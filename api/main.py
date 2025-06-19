from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
from typing import Dict, Any, List
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv('../.env.local')  # Look in parent directory
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set. Please check your .env.local file.")

# Create FastAPI app
app = FastAPI(
    title="Life Tracker API",
    description="API for emotion analysis and task suggestions",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the emotion classifier
try:
    model_name = "j-hartmann/emotion-english-distilroberta-base"
    emotion_classifier = pipeline(
        "sentiment-analysis",
        model=model_name,
        device=-1,
        top_k=1
    )
except Exception as e:
    print(f"Error initializing model: {str(e)}")
    raise

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

# Request Models
class TextRequest(BaseModel):
    """Request model for text analysis"""
    text: str

    class Config:
        schema_extra = {
            "example": {
                "text": "I feel like today has the potential to be a great day!"
            }
        }

class TaskSuggestionRequest(BaseModel):
    """Request model for task suggestions"""
    thoughts: List[str]
    tasks: List[str]

# Emotion Analysis Routes
@app.post("/analyze", response_model=Dict[str, Any])
async def analyze_emotion(req: TextRequest) -> Dict[str, Any]:
    """
    Analyze the emotion in the provided text.
    
    Args:
        req (TextRequest): The text to analyze
        
    Returns:
        Dict[str, Any]: The emotion analysis result
        
    Raises:
        HTTPException: If there's an error processing the request
    """
    try:
        if not req.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
            
        result = emotion_classifier(req.text)
        return {"emotion": result[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing text: {str(e)}")

# Task Suggestion Routes
@app.post("/suggest-task")
async def suggest_task(data: TaskSuggestionRequest):
    """
    Generate a task suggestion based on thoughts and existing tasks.
    
    Args:
        data (TaskSuggestionRequest): The thoughts and tasks to analyze
        
    Returns:
        Dict[str, str]: The suggested task
    """
    thought_lines = '\n- '.join(data.thoughts)
    task_lines = '\n- '.join(data.tasks)
    prompt = f"""
You are an intelligent assistant that helps organize unstructured thoughts and tasks into a focused action item. Given the following inputs, analyze and synthesize them into a single, meaningful suggested task that helps move things forward.

Inputs:
Thoughts:
- {thought_lines}

Tasks:
- {task_lines}

Your job:
1. Understand the intent and priorities behind the thoughts and tasks.
2. Output a single suggested task that would have the most meaningful impact.
3. Be specific and action-oriented.

Respond with only the suggested task.
"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    suggestion = response.choices[0].message.content
    return {"suggestedTask": suggestion}

@app.post("/insight-summary")
async def give_insight_summary(data: TaskSuggestionRequest):
    thought_lines = '\n- '.join(data.thoughts)
    task_lines = '\n- '.join(data.tasks)

    prompt = f"""
    You are an intelligent assistant that helps organize unstructured thoughts and tasks into a focused action item. Given the following inputs, analyze and synthesize them into a summary of insights into their minds that they otherwise may not realize. 
    
    Inputs:
    Thoughts:{thought_lines}
    Tasks:{task_lines}
    
    Your Job: 
    1. Understand the mind of the user, analyzing for trends in their thought process and the reasoning behind these thoughts.
    2. Output a single paragraph outlining these insights, prioritizing give insights that they otherwise may not realize on their own. 
    3. Refrain from using language such as "the user" or "this person", instead saying "you" and "you're". Speak directly to the person.
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )

    insights = response.choices[0].message.content
    return insights


# Health Check Route
@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy"}