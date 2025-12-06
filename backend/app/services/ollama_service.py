import subprocess
import time
import requests
import json
import os
from threading import Thread

class OllamaManager:
    def __init__(self):
        self.base_url = "http://localhost:11434"
        self.current_model = "medllama2"
        self.conversation_history = []
        self.system_prompt = self._load_system_prompt()
    
    def _load_system_prompt(self):
        return """You are HealthGuard AI, an advanced medical assistant capable of symptom analysis and health guidance.
        
        Your Core Directives:
        1. SAFETY FIRST: If symptoms indicate an emergency (chest pain, trouble breathing, severe bleeding, stroke signs), IMMEDIATELY advise calling emergency services (911).
        2. PROFESSIONALISM: Maintain a calm, empathetic, and professional tone.
        3. CLARITY: Explain medical concepts in simple terms.
        4. DISCLAIMER: Always remind users that you are an AI and this is not a formal medical diagnosis.
        
        When analyzing symptoms:
        - Ask relevant follow-up questions to clarify severity and duration.
        - Consider age and underlying conditions if known.
        - Provide structured advice: Possible causes, Recommendations, and Urgency level.
        """

    def generate_response(self, user_message, temperature=0.3, max_tokens=500):
        
        messages = [
            {"role": "system", "content": self.system_prompt},
            *self.conversation_history[-6:], 
            {"role": "user", "content": user_message}
        ]
        
        payload = {
            "model": self.current_model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
                "top_p": 0.9,
                "repeat_penalty": 1.1
            }
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/api/chat",
                json=payload,
                timeout=30 
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result["message"]["content"]
                
                self.conversation_history.append({"role": "user", "content": user_message})
                self.conversation_history.append({"role": "assistant", "content": ai_response})
                
                if len(self.conversation_history) > 10:
                    self.conversation_history = self.conversation_history[-10:]
                
                return ai_response
            elif response.status_code == 404:
                return f"Error: Model '{self.current_model}' not found. Please run 'ollama pull {self.current_model}' in your terminal."
            else:
                return f"Error: {response.status_code} - {response.text}"
                
        except requests.exceptions.Timeout:
            return "The AI is taking too long to respond. Please try again."
        except requests.exceptions.ConnectionError:
            return "I apologize, but I'm currently unable to connect to my local AI brain. Please make sure Ollama is running on your computer."
        except Exception as e:
            print(f"AI Error: {str(e)}")
            return "I'm having trouble thinking right now. Please try again in a moment."
    
    def analyze_symptoms(self, symptoms, user_context=None):
        
        analysis_prompt = f"""
        Analyze these symptoms with structured thinking:
        
        SYMPTOMS: {symptoms}
        
        USER CONTEXT: {json.dumps(user_context or {})}
        
        Follow this thinking process:
        1. Symptom categorization (pain, fever, respiratory, etc.)
        2. Urgency assessment (LOW, MEDIUM, HIGH, EMERGENCY)
        3. Possible causes (list 3-5)
        4. Recommended actions (immediate, within 24h, elective)
        5. Cost estimate (with/without insurance)
        6. Follow-up questions
        
        Output ONLY valid JSON with this structure:
        {{
            "thinking_process": "Brief reasoning steps",
            "urgency": "LOW|MEDIUM|HIGH|EMERGENCY",
            "possible_causes": ["cause1", "cause2", "cause3"],
            "recommendations": {{
                "immediate": ["action1", "action2"],
                "within_24h": ["action1", "action2"],
                "elective": ["action1"]
            }},
            "cost_estimate": {{
                "with_insurance": "$X-$Y",
                "without_insurance": "$A-$B"
            }},
            "follow_up_questions": ["question1", "question2"],
            "disclaimer": "Standard medical disclaimer"
        }}
        """
        
        response = self.generate_response(analysis_prompt, temperature=0.1)
        
        try:
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            if start_idx != -1 and end_idx > start_idx:
                json_str = response[start_idx:end_idx]
                return json.loads(json_str)
        except:
            pass
        
        return {
            "urgency": "MEDIUM",
            "possible_causes": ["Consultation required"],
            "recommendations": {
                "immediate": ["See a doctor"],
                "within_24h": [],
                "elective": []
            },
            "cost_estimate": {"with_insurance": "$100-300", "without_insurance": "$300-1000"},
            "follow_up_questions": ["How long have you had these symptoms?"],
            "disclaimer": "Consult a doctor for proper diagnosis"
        }
    
    def emergency_check(self, symptoms):
        
        emergency_prompt = f"""
        Do these symptoms require EMERGENCY medical attention?
        Symptoms: {symptoms}
        
        Consider: chest pain, difficulty breathing, severe bleeding, unconsciousness, stroke signs, severe trauma.
        
        CRITICAL INSTRUCTION: If the input is just a greeting (hi, hello), asking for help, or clearly NOT a clear medical symptom, set "is_emergency" to false.
        
        Respond in this exact JSON format:
        {{
            "is_emergency": true/false,
            "level": "LOW|MEDIUM|HIGH|EMERGENCY",
            "immediate_actions": ["call_911", "go_to_er", "stay_calm"],
            "message": "Brief explanation"
        }}
        """
        
        response = self.generate_response(emergency_prompt, temperature=0.1)
        
        try:
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            if start_idx != -1:
                return json.loads(response[start_idx:end_idx])
        except:
            pass
        
        emergency_keywords = ['chest pain', 'difficulty breathing', 'severe bleeding', 
                            'unconscious', 'stroke', 'heart attack', 'severe pain']
        is_emergency = any(keyword in symptoms.lower() for keyword in emergency_keywords)
        
        return {
            "is_emergency": is_emergency,
            "level": "EMERGENCY" if is_emergency else "LOW",
            "immediate_actions": ["Call 911"] if is_emergency else ["Monitor symptoms"],
            "message": "Emergency detected" if is_emergency else "No emergency"
        }
    
    def reset_conversation(self):
        self.conversation_history = []
        return True

ollama_manager = OllamaManager()
