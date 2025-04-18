# main.py
from fastapi import FastAPI, Form, HTTPException, Query, Body, UploadFile, File
from pydantic import BaseModel
from services.gemini_game_flow import get_gemini_response
from services.wellness import process_input
from services.scenariosaga import ScenarioSaga
import base64
from chatbot import MentorHerChatbot, ChatQuery, ChatResponse
from agents import seo_optimizer, email_manager, product_recommendation, competitor_watchdog
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from agents.seo_optimizer import AgentRequest as SEORequest
from agents.smart_email_manager import EmailRequest, EmailResponse, generate_email
from agents.product_recomendation import AgentRequest as ProductRequest
from agents.competitor_watchdog import AgentRequest as CompetitorRequest
from dotenv import load_dotenv
from agents.sentiment import SentimentRequest, SentimentResponse, agent as sentiment_agent


load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Character(BaseModel):
    name: str
    age: int

class GameResponse(BaseModel):
    scenario: str
    image: Optional[str] = None
    options: List[str]

class OptionChoice(BaseModel):
    option_index: int

game_instances: Dict[str, ScenarioSaga] = {}


@app.post("/api/career-path")
async def ai_financial_path(
    input: str = Form(...),
    risk: Optional[str] = Form("conservative")
):
    """Generates an AI-based financial planning response."""
    try:
        response = get_gemini_response(input, risk)  
        return JSONResponse(content=response, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Something went wrong: {str(e)}")




# Add import at the top with other imports
from agents.meeting_summarizer import upload_pdf
from agents.post_creator import PostRequest, PostResponse, create_post




# Initialize the chatbot
try:
    shopmart_chatbot = MentorHerChatbot()
except Exception as e:
    logger.critical(f"Chatbot initialization failed: {str(e)}")
    raise

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(query: ChatQuery = Body(...)):
    """Endpoint to process chat queries using the ShopmartChatbot."""
    try:
        response = shopmart_chatbot.process_query(query.query)
        return ChatResponse(response=response)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Error processing chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Define a mapping from agent names to their corresponding functions
AGENT_FUNCTIONS = {
    "seo_optimizer": seo_optimizer,
    "email_manager": email_manager,
    "product_recommendation": product_recommendation,
    "competitor_watchdog": competitor_watchdog,
    "post_creator": create_post,
    "meeting_summarizer": upload_pdf,
    "sentiment_analysis": sentiment_agent.domain_specific_analysis,
    "chat": shopmart_chatbot.process_query,
    # Add other agents as needed
}

# Define a master agent function to provide default input
def master_agent(agent_name, current_data):
    # Logic to provide default input for the agent
    # This can be customized based on the agent's requirements
    return {"default_input": f"Default input for {agent_name}"}

import inspect  # Import inspect to check if a function is a coroutine

async def orchestrate_agents(agent_data: List[Dict[str, Any]]):
    """
    Orchestrates the execution of agents based on provided data.
    
    :param agent_data: List of dictionaries containing agent names and their inputs.
    :return: Final output after processing through all agents.
    """
    current_data = None
    for agent_info in agent_data:
        agent_name = agent_info.get("name")
        agent_input = agent_info.get("input")
        
        agent_function = AGENT_FUNCTIONS.get(agent_name)
        if not agent_function:
            raise ValueError(f"Agent '{agent_name}' not found.")
        
        # Convert agent_input to the expected format if necessary
        if isinstance(agent_input, dict):
            if agent_name == "seo_optimizer":
                current_data = SEORequest(**agent_input)
            elif agent_name == "email_manager":
                current_data = EmailRequest(**agent_input)
            elif agent_name == "product_recommendation":
                current_data = ProductRequest(**agent_input)
            elif agent_name == "competitor_watchdog":
                current_data = CompetitorRequest(**agent_input)
            # Add other agents as needed
        
        # Check if the agent function is a coroutine and await it if necessary
        if inspect.iscoroutinefunction(agent_function):
            current_data = await agent_function(current_data)
        else:
            current_data = agent_function(current_data)
    
    return current_data

@app.post("/api/orchestrate")
async def orchestrate_endpoint(agent_data: List[Dict[str, Any]]):
    """
    Endpoint to orchestrate agents based on the provided data.
    """
    try:
        result = await orchestrate_agents(agent_data)
        return JSONResponse(content=result, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Orchestration failed: {str(e)}")
