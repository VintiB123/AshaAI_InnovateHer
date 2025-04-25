import os
import re
import pandas as pd
from datetime import datetime, date
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from collections import defaultdict
from typing import List, Dict

from langchain_groq import ChatGroq
from langchain_community.vectorstores import Qdrant
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_community import GoogleSearchAPIWrapper

load_dotenv()

# -------------------- FASTAPI SETUP --------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AshaQuery(BaseModel):
    query: str
    user_id: str
    chat_title: str

class ChatTitleRequest(BaseModel):
    message: str  # removed user_id for simplicity

# -------------------- MEMORY STORE --------------------
chat_sessions: Dict[str, Dict[str, List[dict]]] = defaultdict(lambda: defaultdict(list))

# -------------------- EMBEDDINGS & TEXT SPLITTER --------------------
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

# -------------------- VECTOR STORE CACHING --------------------
_vector_stores = None

def get_vector_stores():
    global _vector_stores
    if _vector_stores is not None:
        return _vector_stores

    def load_and_index_dataset(path: str, category: str, formatter):
        df = pd.read_csv(path)
        docs, metadatas = [], []
        for i, row in df.iterrows():
            for chunk in text_splitter.split_text(formatter(row)):
                docs.append(chunk)
                metadatas.append({"source": f"{category}_doc_{i}"})

        collection_name = f"herkey_{category}"
        return Qdrant.from_texts(
            texts=docs,
            embedding=embeddings,
            metadatas=metadatas,
            collection_name=collection_name,
            location=os.getenv("QDRANT_URL"),
            api_key=os.getenv("QDRANT_API_KEY")
        )

    _vector_stores = {
        "jobs": load_and_index_dataset("./datasets/structured_jobs.csv", "jobs", format_job),
        "events": load_and_index_dataset("./datasets/herkey_events.csv", "events", format_event)
    }
    return _vector_stores

# -------------------- MODELS --------------------
llm = ChatGroq(api_key=os.getenv("GROQ_API_TOKEN"), model_name="llama3-70b-8192", temperature=0.5)
title_llm = ChatGroq(api_key=os.getenv("GROQ_API_TOKEN"), model_name="llama3-70b-8192", temperature=0.3)
search = GoogleSearchAPIWrapper()

# -------------------- PROMPTS --------------------
current_date = date.today().isoformat()
guardrails_system_prompt = f"""
You are Asha, the official AI assistant for **HerKey by JobsForHer**...
(omitted for brevity — use the full strict system prompt you previously approved)
"""

# -------------------- FORMATTERS --------------------
def format_job(row):
    return f"""
Imagine yourself at {row['Company']}, where you're stepping into a role titled "{row['Job Title']}"...
"""

def format_event(row):
    return f"""
Don't miss this event: "{row['Title']}" happening on {row['Date']} at {row['Time']}...
"""

# -------------------- TITLE GENERATION --------------------
@app.post("/generate-title")
async def generate_title(req: ChatTitleRequest):
    content = req.message.strip()
    if not content:
        return {"error": "Content cannot be empty."}

    prompt = f"""You are an AI assistant that creates short and relevant titles for chat conversations.

Given the following message from a new chat session, generate a concise, descriptive title (max 8 words). Avoid using punctuation like quotes or emojis.

Message:
{content}

Title:"""
    title = title_llm.invoke(prompt).content.strip()
    return {"title": title}

# -------------------- SMART QUERY --------------------
@app.post("/asha-smart-query")
async def smart_query(query: AshaQuery):
    user_id = query.user_id
    title = query.chat_title

    q = query.query.lower()
    today = datetime.now().date()
    vector_stores = get_vector_stores()

    chat_sessions[user_id][title].append({"role": "user", "content": query.query})

    if any(kw in q for kw in ["who are you", "what is your name", "herkey"]):
        response = "I'm Asha, your AI career companion on HerKey..."
        chat_sessions[user_id][title].append({"role": "assistant", "content": response})
        return {"response": response, "source": "Asha Identity"}

    category = "jobs" if any(k in q for k in ["job", "internship"]) else "events"
    retriever = vector_stores[category].as_retriever(search_type="similarity", search_kwargs={"k": 5})
    docs = retriever.invoke(query.query)

    filtered_docs = [doc for doc in docs if not re.search(r"on (\d{4}-\d{2}-\d{2})", doc.page_content) \
                     or datetime.strptime(re.search(r"on (\d{4}-\d{2}-\d{2})", doc.page_content).group(1), "%Y-%m-%d").date() >= today]

    if not filtered_docs:
        fallback = "I’m not sure at the moment. Kindly check https://www.herkey.com/feed..."
        chat_sessions[user_id][title].append({"role": "assistant", "content": fallback})
        return {"response": fallback}

    context = "\n\n".join([doc.page_content for doc in filtered_docs])
    history = chat_sessions[user_id][title]
    full_history = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in history])
    prompt = f"{guardrails_system_prompt}\n\nChat History:\n{full_history}\n\nContext:\n{context}\n\nUser: {query.query}\nDate: {current_date}"
    response = llm.invoke(prompt).content
    chat_sessions[user_id][title].append({"role": "assistant", "content": response})

    urls = []
    for doc in filtered_docs:
        match = re.search(r"(https?://\S+)", doc.page_content)
        if match:
            urls.append(match.group(1))

    return {"response": response, "source": f"RAG-{category}", "urls": urls}

# -------------------- GET CHAT HISTORY (Updated) --------------------
@app.get("/chat-history")
async def get_chat_history(user_id: str = Query(...)):
    if user_id not in chat_sessions:
        return {"error": "No chat history found for this user."}

    return {
        "user_id": user_id,
        "chats": [
            {"title": title, "history": history}
            for title, history in chat_sessions[user_id].items()
        ]
    }

# -------------------- HEALTH --------------------
@app.get("/health")
def health():
    return {"status": "asha-agentic-ai-ready", "date": current_date}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
