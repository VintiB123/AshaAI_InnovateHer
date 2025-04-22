# main.py

import os
import re
import pandas as pd
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

# ----------------------- FASTAPI SETUP -----------------------
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

# ----------------------- LLM & TOOLS SETUP -----------------------
llm = ChatGroq(api_key=os.getenv("GROQ_API_TOKEN"), model_name="llama3-70b-8192", temperature=0.5)
search = GoogleSearchAPIWrapper()
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)


from datetime import date

current_date = date.today().isoformat()
# ----------------------- GUARDRAILS SYSTEM PROMPT -----------------------
guardrails_system_prompt = """
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

2.
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

# ----------------------- FORMATTING JOBS & EVENTS -----------------------
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

# ----------------------- LOAD & INDEX DATA -----------------------
def load_and_index_dataset(path: str, category: str, formatter):
    df = pd.read_csv(path)
    docs = [formatter(row) for _, row in df.iterrows()]
    texts = []
    metadatas = []
    for i, doc in enumerate(docs):
        chunks = text_splitter.split_text(doc)
        for chunk in chunks:
            texts.append(chunk)
            metadatas.append({"source": f"{category}_doc_{i}"})
    vectorstore = FAISS.from_texts(texts, embeddings, metadatas=metadatas)
    return vectorstore

vector_stores = {
    "jobs": load_and_index_dataset("./datasets/structured_jobs.csv", "jobs", format_job),
    "events": load_and_index_dataset("./datasets/herkey_events.csv", "events", format_event)
}

# ----------------------- PROMPT TEMPLATES -----------------------
rag_prompt = PromptTemplate(
    input_variables=["context", "query","current_date"],
    template=f"""{guardrails_system_prompt}

From the information below, answer the user's query in a conversational and storytelling style.
Always include the job or event link naturally in the response.

📅 You are aware of today’s date: **{current_date}**

Context:
{{context}}

Question:
{{query}}

Answer:
"""
)

web_prompt = PromptTemplate(
    input_variables=["query", "results"],
    template=f"""{guardrails_system_prompt}

Answer the question using the following Google search results in a narrative, story-based tone.

Search Results:
{{results}}

Question:
{{query}}

Response:
"""
)

rag_chain = LLMChain(llm=llm, prompt=rag_prompt)
web_chain = LLMChain(llm=llm, prompt=web_prompt)

# ----------------------- SMART AGENT ROUTE -----------------------
@app.post("/asha-smart-query")
async def smart_query(query: AshaQuery):
    q = query.query.lower()

    # Decide between RAG vs Web
    if any(keyword in q for keyword in ["job", "internship", "career", "resume", "event", "workshop"]):
        category = "jobs" if "job" in q or "internship" in q else "events"
        retriever = vector_stores[category].as_retriever(search_type="similarity", search_kwargs={"k": 5})
        docs = retriever.invoke(query.query)
        context = "\n\n".join([doc.page_content for doc in docs])
        final_prompt = rag_prompt.format(context=context, query=query.query)
        response = llm.invoke(final_prompt).content

        urls = []
        for doc in docs:
            if "jobs" in doc.metadata["source"]:
                match = re.search(r"Link:\s*(https?://\S+)", doc.page_content)
            else:
                match = re.search(r"Event URL:\s*(https?://\S+)", doc.page_content)
            if match:
                urls.append(match.group(1))

        return {"response": response, "source": f"RAG-{category}", "urls": urls}
    else:
        results = search.run(query.query)
        response = web_chain.run({"query": query.query, "results": results})
        return {"response": response, "source": "Google Search"}

# ----------------------- HEALTH CHECK -----------------------
@app.get("/health")
def health():
    return {"status": "asha-agentic-ai-ready", "modes": ["smart", "RAG", "web"]}
