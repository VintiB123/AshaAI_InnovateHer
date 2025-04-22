# main.py

import os
import re
import pandas as pd
from datetime import datetime, date
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_community.vectorstores import FAISS
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

# -------------------- MODELS & TOOLS --------------------
llm = ChatGroq(api_key=os.getenv("GROQ_API_TOKEN"), model_name="llama3-70b-8192", temperature=0.5)
title_llm = ChatGroq(api_key=os.getenv("GROQ_API_TOKEN"), model_name="llama3-70b-8192", temperature=0.3)
search = GoogleSearchAPIWrapper()
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

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

# -------------------- PROMPT TEMPLATES --------------------
rag_prompt = PromptTemplate(
    input_variables=["context", "query", "current_date"],
    template=f"""{guardrails_system_prompt}

Context:
{{context}}

Query:
{{query}}

Answer:
"""
)

web_prompt = PromptTemplate(
    input_variables=["query", "results", "current_date"],
    template=f"""{guardrails_system_prompt}

Use the following Google Search results to answer in a storytelling, empowering tone:

Search Results:
{{results}}

Query:
{{query}}

Response:
"""
)

title_prompt = PromptTemplate(
    input_variables=["chat_content"],
    template="""
You are an AI assistant that creates short and relevant titles for chat conversations.

Given the following user query or conversation context, generate a concise, descriptive title (max 8 words). Avoid using punctuation like quotes or emojis.

Chat Content:
{chat_content}

Title:
"""
)

def generate_chat_title(chat_content: str) -> str:
    formatted_prompt = title_prompt.format(chat_content=chat_content)
    return title_llm.invoke(formatted_prompt).content.strip()

# -------------------- FORMATTERS --------------------
def format_job(row):
    return f"""
Imagine this opportunity: At {row['Company']}, there's a role titled "{row['Job Title']}" located in {row['Location']} ({row['Work Mode']} mode). 
They’re looking for someone with {row['Experience']} of experience in the {row['Industry']} industry, especially within the {row['Functional Area']} domain.
The role demands key skills like {row['Key Skills']}. 

Here’s a quick summary: {row['Job Summary']}
Your responsibilities may include: {row['Responsibilities']}
To qualify, you'll need: {row['Requirements']}

Interested? Explore more or apply here: {row['Link']}
"""

def format_event(row):
    return f"""
Don't miss this event: "{row['Title']}" happening on {row['Date']} at {row['Time']} in {row['Location']} ({row['Mode']} mode). 
It falls under categories like {row['Categories']}. 

Want to join? Register now: {row['Register Link']}  
Learn more here: {row['Event URL']}
"""

# -------------------- LOAD DATASETS --------------------
def load_and_index_dataset(path: str, category: str, formatter):
    df = pd.read_csv(path)
    docs, metadatas = [], []
    for i, row in df.iterrows():
        for chunk in text_splitter.split_text(formatter(row)):
            docs.append(chunk)
            metadatas.append({"source": f"{category}_doc_{i}"})
    return FAISS.from_texts(docs, embeddings, metadatas=metadatas)

vector_stores = {
    "jobs": load_and_index_dataset("./datasets/structured_jobs.csv", "jobs", format_job),
    "events": load_and_index_dataset("./datasets/herkey_events.csv", "events", format_event)
}

# -------------------- SMART QUERY ENDPOINT --------------------
@app.post("/asha-smart-query")
async def smart_query(query: AshaQuery):
    q = query.query.lower()
    today = datetime.now().date()

    if any(keyword in q for keyword in ["job", "internship", "career", "resume", "event", "workshop", "summit", "fair"]):
        category = "jobs" if "job" in q or "internship" in q else "events"
        retriever = vector_stores[category].as_retriever(search_type="similarity", search_kwargs={"k": 5})
        docs = retriever.invoke(query.query)

        # Filter past events/jobs
        filtered_docs = []
        for doc in docs:
            match = re.search(r"on (\d{4}-\d{2}-\d{2})", doc.page_content)
            if match:
                event_date = datetime.strptime(match.group(1), "%Y-%m-%d").date()
                if event_date >= today:
                    filtered_docs.append(doc)
            else:
                filtered_docs.append(doc)

        context = "\n\n".join([doc.page_content for doc in filtered_docs])
        final_prompt = rag_prompt.format(context=context, query=query.query, current_date=current_date)
        response = llm.invoke(final_prompt).content

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
        final_prompt = web_prompt.format(query=query.query, results=results, current_date=current_date)
        response = llm.invoke(final_prompt).content
        return {"response": response, "source": "Google Search"}

# -------------------- CHAT TITLE GENERATOR --------------------
@app.post("/generate-title")
async def title_gen(request: TitleRequest):
    title = generate_chat_title(request.content)
    return {"title": title}

# -------------------- HEALTH CHECK --------------------
@app.get("/health")
def health():
    return {
        "status": "asha-agentic-ai-ready",
        "modes": ["smart-query", "title-generation"],
        "date": current_date
    }
