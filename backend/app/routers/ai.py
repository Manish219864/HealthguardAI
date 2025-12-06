from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.services.medical_chat_service import medical_assistant
from datetime import datetime

router = APIRouter(prefix="/api/ai", tags=["AI Services"])

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "default"

class ContextRequest(BaseModel):
    context: Dict[str, Any]

class AnalysisRequest(BaseModel):
    symptoms: str
    context: Optional[Dict[str, Any]] = {}

class EmergencyCheckRequest(BaseModel):
    symptoms: str

@router.post("/chat")
async def chat(request: ChatRequest):
    """Main chat endpoint"""
    try:
        if not request.message:
            raise HTTPException(status_code=400, detail="No message provided")
        
        # Process the message
        response = medical_assistant.process_message(request.message)
        
        # Add metadata
        response["timestamp"] = datetime.now().isoformat()
        response["message_id"] = f"msg_{datetime.now().timestamp()}"
        response["user_id"] = request.user_id
        
        return response
        
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return {
            "type": "error",
            "content": "I'm having trouble processing that. Please try again.",
            "fallback": True,
            "error": str(e)
        }

@router.post("/update-context")
async def update_context(request: ContextRequest):
    """Update user context"""
    try:
        for key, value in request.context.items():
            medical_assistant.update_context(key, value)
        
        return {
            "status": "success",
            "message": "Context updated",
            "context": medical_assistant.user_context
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze")
async def direct_analysis(request: AnalysisRequest):
    """Direct symptom analysis"""
    try:
        analysis = medical_assistant.ollama.analyze_symptoms(request.symptoms, request.context)
        
        return {
            "type": "analysis",
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/emergency-check")
async def emergency_check(request: EmergencyCheckRequest):
    """Emergency detection endpoint"""
    try:
        result = medical_assistant.ollama.emergency_check(request.symptoms)
        return result
    except Exception as e:
        # Fallback
        return {
            "is_emergency": False,
            "level": "LOW",
            "message": "Error performing check"
        }

@router.post("/reset")
async def reset_conversation():
    """Reset conversation"""
    medical_assistant.reset()
    return {
        "status": "success",
        "message": "Conversation reset"
    }

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        is_healthy = medical_assistant.ollama.check_connection()
        return {
            "status": "healthy" if is_healthy else "unhealthy",
            "ai_model": medical_assistant.ollama.current_model,
            "ollama_running": is_healthy,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

@router.get("/models")
async def list_models():
    """List available Ollama models"""
    try:
        models = medical_assistant.ollama.list_models()
        return {
            "available_models": models,
            "current_model": medical_assistant.ollama.current_model
        }
    except:
        return {
            "available_models": [],
            "current_model": "Unknown"
        }
