from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
from typing import Dict, Any

# Create FastAPI app
app = FastAPI(
    title="Emotion Analysis API",
    description="API for analyzing emotions in text using DistilRoBERTa",
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

class TextRequest(BaseModel):
    """Request model for text analysis"""
    text: str

    class Config:
        schema_extra = {
            "example": {
                "text": "I feel like today has the potential to be a great day!"
            }
        }

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

@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint"""
    return {"status": "healthy"}