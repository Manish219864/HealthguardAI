
const API_BASE_URL = 'http://localhost:8000';

export interface SymptomAnalysis {
    thinking_process: string;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
    possible_causes: string[];
    recommendations: {
        immediate: string[];
        within_24h: string[];
        elective: string[];
    };
    cost_estimate: {
        with_insurance: string;
        without_insurance: string;
    };
    follow_up_questions: string[];
    disclaimer: string;
}

export interface ChatResponse {
    type: 'conversation' | 'analysis' | 'emergency' | 'question' | 'error';
    content: string;
    analysis?: SymptomAnalysis;
    follow_up?: string;
    suggested_actions?: string[];
    context_needed?: boolean;
    timestamp: string;
    message_id: string;
}

export class HealthAIClient {
    private static conversationId = `conv_${Date.now()}`;

    static async sendMessage(message: string): Promise<ChatResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    user_id: this.conversationId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error: unknown) {
            console.error('Chat error:', error);

            if (error instanceof Error && error.message.includes('fetch')) {
                return this.getFallbackResponse(message);
            }

            return this.getFallbackResponse(message);
        }
    }

    private static getFallbackResponse(message: string): ChatResponse {
        const lowerMessage = message.toLowerCase();
        const timestamp = new Date().toISOString();

        if (this.isEmergency(message)) {
            return {
                type: 'emergency',
                content: '🚨 Based on your symptoms, please seek immediate medical attention!',
                suggested_actions: ['Call 911 immediately', 'Go to nearest emergency room'],
                timestamp,
                message_id: `fallback_${Date.now()}`
            };
        }

        const symptoms = ['headache', 'fever', 'pain', 'cough', 'nausea'];
        if (symptoms.some(s => lowerMessage.includes(s))) {
            return {
                type: 'conversation',
                content: "I understand you're not feeling well. How long have you had these symptoms?",
                follow_up: "Can you describe the severity?",
                timestamp,
                message_id: `fallback_${Date.now()}`
            };
        }

        return {
            type: 'conversation',
            content: "Thanks for your message. Could you tell me more about what you're experiencing?",
            follow_up: "What symptoms are you concerned about?",
            timestamp,
            message_id: `fallback_${Date.now()}`
        };
    }

    private static isEmergency(message: string): boolean {
        const emergencies = [
            'chest pain', 'difficulty breathing', 'severe bleeding',
            'unconscious', 'stroke', 'heart attack', 'cannot breathe'
        ];
        return emergencies.some(e => message.toLowerCase().includes(e));
    }

    static async directAnalysis(symptoms: string, context?: Record<string, unknown>) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symptoms,
                    context
                })
            });
            if (!response.ok) throw new Error('Analysis failed');
            return await response.json();
        } catch (error) {
            console.error('Analysis error:', error);
            throw error;
        }
    }

    static async checkEmergency(symptoms: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/emergency-check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symptoms
                })
            });
            if (!response.ok) throw new Error('Emergency check failed');
            return await response.json();
        } catch {
            return {
                is_emergency: this.isEmergency(symptoms),
                level: this.isEmergency(symptoms) ? 'EMERGENCY' : 'LOW',
                message: 'Fallback emergency check'
            };
        }
    }

    static async updateContext(context: Record<string, unknown>) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/update-context`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    context
                })
            });
            return response.ok;
        } catch (error) {
            console.error('Context update failed:', error);
            return false;
        }
    }

    static async resetConversation() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/reset`, {
                method: 'POST'
            });
            this.conversationId = `conv_${Date.now()}`;
            return response.ok;
        } catch (error) {
            console.error('Reset failed:', error);
            return false;
        }
    }

    static async healthCheck() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/health`);
            if (!response.ok) throw new Error('Health check failed');
            return await response.json();
        } catch {
            return {
                status: 'unhealthy',
                ai_model: 'Unknown',
                ollama_running: false,
                timestamp: new Date().toISOString()
            };
        }
    }

    static async listModels() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ai/models`);
            if (!response.ok) throw new Error('List models failed');
            return await response.json();
        } catch {
            return {
                available_models: [],
                current_model: 'Unknown'
            };
        }
    }
}
