import json
import re
from datetime import datetime
from typing import Dict, List, Optional
from app.services.ollama_service import ollama_manager

class MedicalChatAssistant:
    def __init__(self, ollama_manager):
        self.ollama = ollama_manager
        self.user_context = {}
        self.conversation_state = "greeting"
        
        self.flows = {
            "greeting": [
                "Hello! I'm HealthGuard AI. How can I help you today?",
                "What symptoms are you experiencing?"
            ],
            "exploring": [
                "How long have you had these symptoms?",
                "Can you describe the severity (mild, moderate, severe)?",
                "Where exactly is the pain/discomfort located?",
                "Does anything make it better or worse?",
                "Any other symptoms like fever, dizziness, or nausea?"
            ],
            "context": [
                "May I ask your age? (This helps with assessment)",
                "Do you have any existing medical conditions?",
                "Are you currently taking any medications?",
                "Any known allergies?"
            ],
            "analyzing": [
                "Based on what you've told me, let me analyze...",
                "I have some insights to share..."
            ]
        }
    
    def process_message(self, user_message: str) -> Dict:
        """Process user message and return appropriate response"""
        
        
        self._extract_info(user_message)
        
        if self.conversation_state == "greeting":
            greetings = ['hi', 'hello', 'hey', 'greetings', 'sup', 'yo', 'good morning', 'good afternoon']
            is_greeting = any(user_message.lower().strip().startswith(g) for g in greetings)
            
            if not is_greeting:
                emergency_check = self.ollama.emergency_check(user_message)
                if emergency_check.get("is_emergency"):
                    return {
                        "type": "emergency",
                        "content": emergency_check.get("message", "Emergency detected"),
                        "suggested_actions": emergency_check.get("immediate_actions", ["🚨 Call 911 immediately"]),
                        "analysis": emergency_check 
                    }
        
        self._update_state(user_message)
        
        ai_response = self.ollama.generate_response(user_message)
        
        # Check if analysis is ready
        if self._should_analyze():
            analysis = self.ollama.analyze_symptoms(
                self._get_symptom_summary(),
                self.user_context
            )
            
            return {
                "type": "analysis",
                "content": ai_response,
                "analysis": analysis,
                "next_step": "Would you like me to explain any part of the analysis?"
            }
        
        # Check if we need more context
        if self.conversation_state == "context" and not self.user_context.get("age"):
            return {
                "type": "question",
                "content": ai_response,
                "follow_up": self.flows["context"][0],
                "context_needed": True
            }
        
        # Regular conversation
        follow_up = self._get_follow_up_question()
        
        return {
            "type": "conversation",
            "content": ai_response,
            "follow_up": follow_up,
            "state": self.conversation_state
        }
    
    
    def _update_state(self, user_message: str):
        if self.conversation_state == "greeting":
            self.conversation_state = "exploring"
        elif self.conversation_state == "exploring" and self._has_enough_symptoms():
            self.conversation_state = "context"
        elif self.conversation_state == "context" and self._has_enough_context():
            self.conversation_state = "analyzing"
    
    def _has_enough_symptoms(self) -> bool:
        symptom_keywords = ['pain', 'ache', 'fever', 'cough', 'headache', 
                          'nausea', 'dizzy', 'fatigue', 'swelling']
        messages = [msg["content"] for msg in self.ollama.conversation_history 
                   if msg["role"] == "user"]
        
        if len(messages) >= 2:
            return True
        
        for msg in messages:
            if any(keyword in msg.lower() for keyword in symptom_keywords):
                return True
        
        return False
    
    def _has_enough_context(self) -> bool:
        return bool(self.user_context.get("age"))
    
    def _should_analyze(self) -> bool:
        return (self.conversation_state == "analyzing" and 
                len([msg for msg in self.ollama.conversation_history 
                    if msg["role"] == "user"]) >= 3)
    
    def _get_symptom_summary(self) -> str:
        user_messages = [msg["content"] for msg in self.ollama.conversation_history 
                        if msg["role"] == "user"]
        return " | ".join(user_messages[-3:])  
    
    def _get_follow_up_question(self) -> str:
        """Get appropriate follow-up question based on state"""
        if self.conversation_state == "exploring":
            idx = len([msg for msg in self.ollama.conversation_history 
                      if msg["role"] == "user"]) - 1
            if idx < len(self.flows["exploring"]):
                return self.flows["exploring"][idx]
        
        elif self.conversation_state == "context":
            if not self.user_context.get("age"):
                return self.flows["context"][0]
            elif not self.user_context.get("conditions"):
                return self.flows["context"][1]
        
        return "Is there anything else you'd like to tell me about your symptoms?"
    
    
    def _extract_info(self, message: str):
        age_patterns = [
            r"age is (\d+)",
            r"i am (\d+)",
            r"(\d+) years old",
            r"^(\d+)$" 
        ]
        
        for pattern in age_patterns:
            match = re.search(pattern, message.lower())
            if match:
                self.user_context["age"] = match.group(1)
                break

    def update_context(self, key: str, value: str):
        """Update user context"""
        self.user_context[key] = value
    
    def reset(self):
        """Reset the conversation"""
        self.ollama.reset_conversation()
        self.user_context = {}
        self.conversation_state = "greeting"
        return True

# Create assistant instance
medical_assistant = MedicalChatAssistant(ollama_manager)
