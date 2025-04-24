import os
import re
import pandas as pd
from datetime import datetime, date
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_community.vectorstores import Qdrant
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.utilities import GoogleSearchAPIWrapper
from langchain.memory import ConversationBufferMemory

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

class TitleRequest(BaseModel):
    content: str

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
            location="https://3e3b87fc-8480-4f68-89a0-a352813de8cd.us-west-1-0.aws.cloud.qdrant.io",
            api_key=os.getenv("QDRANT_API_KEY")
        )

    _vector_stores = {
        "jobs": load_and_index_dataset("./datasets/structured_jobs.csv", "jobs", format_job),
        "events": load_and_index_dataset("./datasets/herkey_events.csv", "events", format_event)
    }
    return _vector_stores

# -------------------- MEMORY FOR CHAT HISTORY --------------------
llm_memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# -------------------- MODELS & TOOLS --------------------
llm = ChatGroq(api_key=os.getenv("GROQ_API_TOKEN"), model_name="llama3-70b-8192", temperature=0.5)
title_llm = ChatGroq(api_key=os.getenv("GROQ_API_TOKEN"), model_name="llama3-70b-8192", temperature=0.3)
search = GoogleSearchAPIWrapper()

# -------------------- SYSTEM PROMPT --------------------
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
"""

def format_event(row):
    return f"""
Don't miss this event: "{row['Title']}" happening on {row['Date']} at {row['Time']} in {row['Location']} ({row['Mode']} mode). 
It falls under categories like {row['Categories']}. 

Want to join? Register now: {row['Register Link']}  
Learn more here: {row['Event URL']}
"""

# -------------------- QUERY REFINEMENT --------------------
def refine_query_with_context(history: str, query: str) -> str:
    refinement_prompt = f"""
You are an assistant that refines vague or follow-up queries into clear, standalone questions.

Chat History:
{history}

User's Query: "{query}"

Refined Query (self-contained and specific):
"""
    return llm.invoke(refinement_prompt).content.strip()

# -------------------- SMART QUERY ENDPOINT --------------------
@app.post("/asha-smart-query")
async def smart_query(query: AshaQuery):
    if not query.query or not query.query.strip():
        return {"error": "Query cannot be empty."}

    q = query.query.lower()
    today = datetime.now().date()
    vector_stores = get_vector_stores()
    llm_memory.chat_memory.add_user_message(query.query)
    history = llm_memory.load_memory_variables({})["chat_history"]
    refined_query = refine_query_with_context(history, query.query)

    identity_keywords = [
        "who are you", "what is your name", "tell me about yourself", "what can you do",
        "what is your role", "what do you do", "herkey", "jobsforher", "what is herkey"
    ]
    if any(phrase in q for phrase in identity_keywords):
        identity_response = (
            "I'm Asha, your AI career companion on **HerKey by JobsForHer** — a platform designed to help women "
            "restart, grow, and transform their careers. 🌟\n\n"
            "I’m here to support you by sharing career opportunities, recommending upskilling events, and answering questions "
            "related to personal and professional growth. If you're seeking jobs, internships, workshops, or just some guidance — "
            "I'm here to help with empathy, clarity, and encouragement.\n\n"
            "Let’s explore your next step together!"
        )
        llm_memory.chat_memory.add_ai_message(identity_response)
        return {"response": identity_response, "source": "Asha Identity"}

    is_contextual_query = any(word in q for word in ["job", "internship", "career", "resume", "event", "workshop", "summit", "fair"])
    is_follow_up = len(llm_memory.chat_memory.messages) > 1

    if is_contextual_query:
        category = "jobs" if "job" in q or "internship" in q else "events"
        retriever = vector_stores[category].as_retriever(search_type="similarity", search_kwargs={"k": 5})
        docs = retriever.invoke(refined_query)

        filtered_docs = []
        for doc in docs:
            match = re.search(r"on (\d{4}-\d{2}-\d{2})", doc.page_content)
            if match:
                event_date = datetime.strptime(match.group(1), "%Y-%m-%d").date()
                if event_date >= today:
                    filtered_docs.append(doc)
            else:
                filtered_docs.append(doc)

        if not filtered_docs:
            return {"response": "I’m not sure at the moment. Kindly check https://www.herkey.com/feed — new events and jobs will be posted there."}

        context = "\n\n".join([doc.page_content for doc in filtered_docs])
        prompt = f"{guardrails_system_prompt}\n\nChat History:\n{history}\n\nContext:\n{context}\n\nQuery: {refined_query}\nDate: {current_date}"
        response = llm.invoke(prompt).content
        llm_memory.chat_memory.add_ai_message(response)

        urls = []
        for doc in filtered_docs:
            if "jobs" in doc.metadata["source"]:
                match = re.search(r"Link:\s*(https?://\S+)", doc.page_content)
            else:
                match = re.search(r"Event URL:\s*(https?://\S+)", doc.page_content)
            if match:
                urls.append(match.group(1))

        return {"response": response, "source": f"RAG-{category}", "urls": urls}

    elif is_follow_up:
        prompt = f"{guardrails_system_prompt}\n\nUse the conversation below to answer the follow-up query:\n\nChat History:\n{history}\n\nUser: {refined_query}\n\nAssistant:"
        response = llm.invoke(prompt).content
        llm_memory.chat_memory.add_ai_message(response)
        return {"response": response, "source": "LLM Contextual Follow-up"}

    else:
        results = search.run(refined_query)
        prompt = f"{guardrails_system_prompt}\n\nGoogle Results:\n{results}\n\nUser: {refined_query}\n\nAssistant:"
        response = llm.invoke(prompt).content
        llm_memory.chat_memory.add_ai_message(response)
        return {"response": response, "source": "Google Search"}

# -------------------- TITLE GENERATION ENDPOINT --------------------
@app.post("/generate-title")
async def title_gen_from_history():
    messages = llm_memory.chat_memory.messages

    if not messages:
        return {"error": "Chat history is empty."}

    history_text = "\n".join([f"{msg.type.capitalize()}: {msg.content}" for msg in messages])

    prompt = f"""You are an AI assistant that creates short and relevant titles for chat conversations.

Given the following conversation, generate a concise, descriptive title (max 8 words). Avoid using punctuation like quotes or emojis.

Chat:
{history_text}

Title:"""

    title = title_llm.invoke(prompt).content.strip()
    return {"title": title}

# -------------------- HEALTH CHECK ENDPOINT --------------------
@app.get("/health")
def health():
    return {
        "status": "asha-agentic-ai-ready",
        "modes": ["smart-query", "title-generation"],
        "date": current_date
    }

# -------------------- RESET HISTORY ENDPOINT --------------------
@app.post("/reset-history")
async def reset_history():
    llm_memory.clear()
    return {"message": "Chat history cleared."}
