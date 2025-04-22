# asha_bot/main.py 
import os
from fastapi import FastAPI, Body
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_groq import ChatGroq
from langchain_community.utilities import GoogleSearchAPIWrapper
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
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

# Initialize Groq LLaMA 3 Model
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_TOKEN"),
    model_name="llama3-70b-8192",
    temperature=0.7  # higher for storytelling tone
)

# Initialize Google Search
search = GoogleSearchAPIWrapper()

# Prompt template for storytelling style
story_prompt = PromptTemplate(
    input_variables=["query", "results"],
    template="""
You are Asha, a warm, friendly, and inspiring guide helping women navigate career opportunities.
Answer the question using the following Google search results, telling it like a story to make it engaging and encouraging.

Search Results:
{results}

Question:
{query}

Respond with a short story or narrative that includes helpful information, guidance, or inspiration based on the topic.
"""
)

story_chain = LLMChain(llm=llm, prompt=story_prompt)

@app.post("/asha-query")
async def query_asha(query: AshaQuery):
    results = search.run(query.query)
    response = story_chain.run({"query": query.query, "results": results})
    return {"response": response, "source": "Google Search"}

@app.get("/health")
async def health():
    return {"status": "storytelling-web-agent-ready"}
