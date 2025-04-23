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
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_community.utilities import GoogleSearchAPIWrapper

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

# -------------------- MODELS & TOOLS --------------------
llm = ChatGroq(api_key=os.getenv("GROQ_API_TOKEN"), model_name="llama3-70b-8192", temperature=0.5)
title_llm = ChatGroq(api_key=os.getenv("GROQ_API_TOKEN"), model_name="llama3-70b-8192", temperature=0.3)
search = GoogleSearchAPIWrapper()

# -------------------- SYSTEM PROMPT --------------------
current_date = date.today().isoformat()
guardrails_system_prompt = f"""
You are Asha, the official AI assistant for **HerKey by JobsForHer** — a platform dedicated to helping women discover jobs, upskill through events, and restart their careers.

Your role is to guide women with professionalism, empathy, and empowerment — offering respectful, accurate, and growth-focused information on career opportunities, upskilling, and personal development.

🔐 STRICT GUARDRAILS — NEVER VIOLATE THESE:

1. ❌ You MUST NOT:
   - Respond to or encourage gossip, rumors, or personal drama
   - Generate inappropriate, harmful, unethical, or illegal content
   - Disclose sensitive, internal, or confidential information about HerKey or JobsForHer
   - Mention, compare, or discuss competitors of HerKey or JobsForHer
   - Reinforce stereotypes, sexism, or gender bias
   - Engage in personal speculation or political content

2. 📅 You are aware of today’s date: **{current_date}**
   - Only recommend **upcoming or future** events and job opportunities
   - Do NOT include expired, outdated, or irrelevant opportunities

3. 💬 If the question is outside your purpose or violates these guardrails, respond with:
   > "I'm here to support your career journey with HerKey. Let's focus on something helpful for your growth."

4. ✅ Maintain a supportive and inclusive tone at all times:
   - Use storytelling and warm, motivational language
   - Recommend only trustworthy, on-topic, growth-focused resources
   - Guide users with optimism, clarity, and encouragement

---

Your mission is to empower every woman — whether she's restarting, growing, or exploring her career — by sharing safe, ethical, and inspirational guidance. Let every answer reflect that purpose.
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

# -------------------- PROMPT TEMPLATES --------------------
rag_prompt = """Use this context to answer the query as a helpful assistant:\n\n{context}\n\nQuery: {query}\n\nDate: {current_date}"""
web_prompt = """Here are the top results from Google:\n\n{results}\n\nQuery: {query}\nDate: {current_date}\n\nProvide a helpful response."""

# -------------------- TITLE GENERATOR --------------------
def generate_chat_title(content: str) -> str:
    prompt = f"""You are an AI assistant that creates short and relevant titles for chat conversations.

Given the following user query or conversation context, generate a concise, descriptive title (max 8 words). Avoid using punctuation like quotes or emojis.

Chat Content:
{content}

Title:"""
    return title_llm.invoke(prompt).content.strip()

# -------------------- ENDPOINTS --------------------
@app.post("/asha-smart-query")
async def smart_query(query: AshaQuery):
    if not query.query or not query.query.strip():
        return {"error": "Query cannot be empty."}

    q = query.query.lower()
    today = datetime.now().date()
    vector_stores = get_vector_stores()

    if any(keyword in q for keyword in ["job", "internship", "career", "resume", "event", "workshop", "summit", "fair"]):
        category = "jobs" if "job" in q or "internship" in q else "events"
        retriever = vector_stores[category].as_retriever(search_type="similarity", search_kwargs={"k": 5})
        docs = retriever.invoke(query.query)

        if not docs:
            return {"error": "No relevant documents found."}

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
            return {"error": "No upcoming events or jobs found."}

        context = "\n\n".join([doc.page_content for doc in filtered_docs])
        final_prompt = guardrails_system_prompt + "\n\n" + rag_prompt.format(context=context, query=query.query, current_date=current_date)

        response = llm.invoke(final_prompt).content

        if not response:
            return {"error": "No response from the model."}

        urls = []
        for doc in filtered_docs:
            if "jobs" in doc.metadata["source"]:
                match = re.search(r"Link:\s*(https?://\S+)", doc.page_content)
            else:
                match = re.search(r"Event URL:\s*(https?://\S+)", doc.page_content)
            if match:
                urls.append(match.group(1))

        return {"response": response, "source": f"RAG-{category}", "urls": urls}
    else:
        results = search.run(query.query)
        if not results:
            return {"error": "No search results found."}

        final_prompt = web_prompt.format(query=query.query, results=results, current_date=current_date)
        response = llm.invoke(final_prompt).content
        if not response:
            return {"error": "No response from the model."}
        return {"response": response, "source": "Google Search"}

@app.post("/generate-title")
async def title_gen(request: TitleRequest):
    if not request.content or not request.content.strip():
        return {"error": "Content cannot be empty."}

    title = generate_chat_title(request.content)
    return {"title": title}

@app.get("/health")
def health():
    return {
        "status": "asha-agentic-ai-ready",
        "modes": ["smart-query", "title-generation"],
        "date": current_date
    }
