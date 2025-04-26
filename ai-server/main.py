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
    message: str

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
        full_path = os.path.join(os.path.dirname(__file__), path)
        df = pd.read_csv(full_path)
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
        "jobs": load_and_index_dataset("datasets/structured_jobs.csv", "jobs", format_job),
        "events": load_and_index_dataset("datasets/herkey_events.csv", "events", format_event)
    }
    return _vector_stores

# -------------------- MODELS --------------------
llm = ChatGroq(api_key=os.getenv("GROQ_API_TOKEN"), model_name="llama3-70b-8192", temperature=0.5)
title_llm = ChatGroq(api_key=os.getenv("GROQ_API_TOKEN"), model_name="llama3-70b-8192", temperature=0.3)
search = GoogleSearchAPIWrapper()

# -------------------- PROMPTS --------------------
current_date = date.today().isoformat()
guardrails_system_prompt = f"""
You are Asha, the official AI assistant for **HerKey by JobsForHer** — a platform dedicated to empowering women to discover jobs, upskill through events, and restart their careers.

🧠 You are kind, respectful, motivational, and highly professional. You communicate clearly and always prioritize accurate, growth-focused, and context-relevant guidance.

🔐 SYSTEM RULES — NEVER VIOLATE:
1. DO NOT invent or assume jobs, events, or facts not explicitly stated in the provided context.
2. DO NOT mention competitors or generate comparisons.
3. DO NOT discuss sensitive, political, religious, or personal topics.
4. DO NOT speculate, guess, or fabricate answers — if information is unavailable, say so clearly.
5. DO NOT break confidentiality, share internal details, or reference private data.
6. DO NOT HALLUCINATE.

📅 You are aware of today’s date: **{current_date}**.
- Only suggest jobs/events that are explicitly upcoming or ongoing.
- Do NOT mention expired or undated opportunities.

💬 RESPONSE STYLE:
- Use a supportive, encouraging tone.
- Provide helpful, safe, and inclusive career guidance.
- Speak like a real, kind career coach — never robotic.
- Use emojis 🌟 only when they enhance clarity or warmth.

🧾 INSTRUCTIONS:
Use ONLY the retrieved context below and chat history (if present) to respond to the user's query. If the answer is not available in the provided content, respond with:

> "I'm here to help with your career journey, but I couldn’t find that information right now. Would you like to explore other options or connect with a human support advisor?"

✨ In case of errors or unhelpful results, gently offer:

> "If something seems off, please let me know so we can improve your experience. Your feedback helps us serve you better."

If you don’t find any event or job, say:

> "I’m not sure at the moment. Kindly check https://www.herkey.com/feed — new events and jobs will be posted there."

Your mission is to uplift, guide, and support every woman’s career journey with accuracy, empathy, and reliability — while ensuring graceful fallback and continuous improvement.
You are Asha, the official AI assistant for **HerKey by JobsForHer**...
(omitted for brevity — use the full strict system prompt you previously approved)
"""

# -------------------- FORMATTERS --------------------
def format_job(row):
    return f"""
Imagine yourself at {row['Company']}, where you're stepping into a role titled "{row['Job Title']}" located in {row['Location']} ({row['Work Mode']} mode). 
In this role, you'll have the chance to use your {row['Experience']} years of experience in the {row['Industry']} industry, specifically focusing on {row['Functional Area']}.
They’re looking for someone who possesses key skills like {row['Key Skills']}, ready to make a difference. 

Picture this: You'll be responsible for {row['Responsibilities']}, contributing to the team’s success while constantly learning and growing. 
To be successful in this role, you’ll need {row['Requirements']}, so that you can help {row['Company']} make great strides in its mission. 

Ready to take this exciting leap? Explore the opportunity and apply today: {row['Link']}
Imagine yourself at {row['Company']}, where you're stepping into a role titled "{row['Job Title']}"...
"""

def format_event(row):
    return f"""
Don't miss this event: "{row['Title']}" happening on {row['Date']} at {row['Time']} in {row['Location']} ({row['Mode']} mode). 
It falls under categories like {row['Categories']}. 

Want to join? Register now: {row['Register Link']}  
Learn more here: {row['Event URL']}
Don't miss this event: "{row['Title']}" happening on {row['Date']} at {row['Time']}...
"""

# -------------------- SIMPLE NLP QUERY REFINER --------------------
def refine_user_query(raw_query: str) -> str:
    refined_query = raw_query.strip()
    refined_query = re.sub(r"[^\w\s\-\?]", "", refined_query)  # Remove unwanted symbols
    refined_query = re.sub(r"\s+", " ", refined_query)  # Normalize spaces
    return refined_query

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

    raw_query = query.query
    refined_query = refine_user_query(raw_query)

    q = refined_query.lower()
    today = datetime.now().date()
    vector_stores = get_vector_stores()

    chat_sessions[user_id][title].append({"role": "user", "content": refined_query})

    if any(kw in q for kw in ["who are you", "what is your name", "herkey"]):
        response = "I'm Asha, your AI career companion on HerKey..."
        chat_sessions[user_id][title].append({"role": "assistant", "content": response, "urls": []})
        return {"response": response, "source": "Asha Identity"}

    category = "jobs" if any(k in q for k in ["job", "internship"]) else "events"
    retriever = vector_stores[category].as_retriever(search_type="similarity", search_kwargs={"k": 5})
    docs = retriever.invoke(refined_query)

    filtered_docs = [doc for doc in docs if not re.search(r"on (\d{4}-\d{2}-\d{2})", doc.page_content) \
                     or datetime.strptime(re.search(r"on (\d{4}-\d{2}-\d{2})", doc.page_content).group(1), "%Y-%m-%d").date() >= today]

    urls = []
    for doc in filtered_docs:
        match = re.search(r"(https?://\S+)", doc.page_content)
        if match:
            urls.append(match.group(1))

    if not filtered_docs:
        fallback = "I’m not sure at the moment. Kindly check https://www.herkey.com/feed..."
        chat_sessions[user_id][title].append({"role": "assistant", "content": fallback, "urls": urls})
        return {"response": fallback}

    context = "\n\n".join([doc.page_content for doc in filtered_docs])
    history = chat_sessions[user_id][title]
    full_history = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in history])
    prompt = f"{guardrails_system_prompt}\n\nChat History:\n{full_history}\n\nContext:\n{context}\n\nUser: {refined_query}\nDate: {current_date}"
    response = llm.invoke(prompt).content
    chat_sessions[user_id][title].append({"role": "assistant", "content": response, "urls": urls})

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

@app.get("/")
def read_root():
    return {"message": "Welcome to Asha AI - HerKey Assistant"}

# -------------------- PRELOAD VECTORS DURING STARTUP --------------------
@app.on_event("startup")
async def preload_vector_stores():
    get_vector_stores()

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
