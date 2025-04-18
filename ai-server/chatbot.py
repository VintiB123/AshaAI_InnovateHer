import os
import logging
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from dotenv import load_dotenv

# Initialize logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("MentorHer")

# Load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for chat input and output
class ChatQuery(BaseModel):
    query: str

class ChatResponse(BaseModel):
    response: str

class MentorHerChatbot:
    def __init__(self):
        self.api_token = os.getenv("GROQ_API_TOKEN")
        if not self.api_token:
            raise ValueError("GROQ_API_TOKEN environment variable not set")
        
        # Initialize the AI model
        self.model = ChatGroq(
            api_key=self.api_token,
            model_name="llama3-70b-8192",
            temperature=0.2,
            max_tokens=250  # Increased for better responses
        )
        logger.info("Chatbot initialized successfully")

    def process_query(self, query: str) -> str:
        if not query.strip():
            raise ValueError("Empty query provided")

        # Define the system prompt
        system_prompt = """
        You are MentorHer, an AI-powered mentor dedicated to guiding, inspiring, and supporting women in tech. 
        Your role is to provide career advice, learning resources, and motivation for personal and professional growth. 
        Respond in an empathetic, insightful, and growth-oriented manner.
        """

        # Combine system prompt with the user query
        user_prompt = f"User Query: {query}"

        try:
            response = self.model.invoke(system_prompt + "\n" + user_prompt).content
        except Exception as e:
            logger.error(f"Model invocation failed: {str(e)}")
            raise HTTPException(status_code=500, detail="Model invocation failed")

        return response

# Initialize the chatbot
try:
    chatbot = MentorHerChatbot()
except Exception as e:
    logger.critical(f"Chatbot initialization failed: {str(e)}")
    raise

@app.post("/chat", response_model=ChatResponse)
async def chat(query: ChatQuery = Body(...)):
    try:
        response = chatbot.process_query(query.query)
        return ChatResponse(response=response)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error processing chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "groq_connected": chatbot.api_token is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)