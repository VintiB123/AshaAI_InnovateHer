import os
import re
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_community.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

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

# Initialize LLM and embeddings
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_TOKEN"),
    model_name="llama3-70b-8192",
    temperature=0.5
)

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

# Format job info for retrieval
def format_job_row(row):
    return f"""
Imagine this opportunity: At {row['Company']}, there's a role titled "{row['Job Title']}" located in {row['Location']} ({row['Work Mode']} mode). 
They’re looking for someone with {row['Experience']} of experience in the {row['Industry']} industry, especially within the {row['Functional Area']} domain.
The role demands key skills like {row['Key Skills']}. 

Here’s a quick summary: {row['Job Summary']}
Your responsibilities may include: {row['Responsibilities']}
To qualify, you'll need: {row['Requirements']}

Interested? Explore more or apply here: {row['Link']}
"""

# Format event info for retrieval
def format_event_row(row):
    return f"""
Don't miss this event: "{row['Title']}" happening on {row['Date']} at {row['Time']} in {row['Location']} ({row['Mode']} mode). 
It falls under categories like {row['Categories']}. 

Want to join? Register now: {row['Register Link']}  
Learn more here: {row['Event URL']}
"""

# Load and index datasets
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
    store_path = f"./data/vector_stores/{category}"
    os.makedirs(store_path, exist_ok=True)
    vectorstore.save_local(store_path)
    return vectorstore

vector_stores = {
    "jobs": load_and_index_dataset("D:\\DJSCE\\Hackathon\\AshaAI_InnovateHer\\ai-server\\datasets\\structured_jobs.csv", "jobs", format_job_row),
    "events": load_and_index_dataset("D:\\DJSCE\\Hackathon\\AshaAI_InnovateHer\\ai-server\\datasets\\herkey_events.csv", "events", format_event_row)
}

# Storytelling prompt for Asha
rag_prompt = PromptTemplate(
    input_variables=["context", "query"],
    template="""
You are Asha, a friendly and helpful career assistant for women.
From the information below, answer the user's query in a conversational and storytelling style.
Always include the job or event link naturally in the response.

Context:
{context}

Question:
{query}

Answer:
"""
)

@app.post("/asha-rag-query")
async def query_rag(query: AshaQuery):
    matched_category = "jobs" if "job" in query.query.lower() else "events"
    retriever = vector_stores[matched_category].as_retriever(search_type="similarity", search_kwargs={"k": 5})
    docs = retriever.invoke(query.query)
    context = "\n\n".join([doc.page_content for doc in docs])
    final_prompt = rag_prompt.format(context=context, query=query.query)
    response = llm.invoke(final_prompt).content

    # Extract URLs (optional but useful for frontend buttons)
    urls = []
    for doc in docs:
        if "jobs" in doc.metadata["source"]:
            match = re.search(r"Link:\s*(https?://\S+)", doc.page_content)
        else:
            match = re.search(r"Event URL:\s*(https?://\S+)", doc.page_content)
        if match:
            urls.append(match.group(1))

    return {
        "response": response,
        "urls": urls
    }

@app.get("/health")
async def health():
    return {"status": "rag-agent-ready", "categories": list(vector_stores.keys())}
