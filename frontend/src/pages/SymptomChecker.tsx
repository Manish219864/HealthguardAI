import { useState, useRef, useEffect } from 'react'
import {
    Send, AlertTriangle, MapPin, Share2, Loader2,
    Zap, Shield, User, Thermometer, Pill, Brain,
    RefreshCw, MessageSquare, Stethoscope, Save
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { HealthAIClient } from '../lib/healthAI'
import type { SymptomAnalysis } from '../lib/healthAI'

interface Message {
    id: number
    role: 'user' | 'ai'
    content: string
    timestamp: Date
}

export default function SymptomChecker() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: 'ai',
            content: "👋 Hello! I'm HealthGuard AI, your medical assistant. What symptoms are you experiencing today?",
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null)
    const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null)
    const [aiStatus, setAiStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting')
    const [conversationStage, setConversationStage] = useState<'greeting' | 'exploring' | 'analyzing' | 'followup'>('greeting')
    const [userContext, setUserContext] = useState({
        age: null as number | null,
        hasMedicalHistory: false,
        contextProvided: false
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        initializeAI()
    }, [])

    const initializeAI = async () => {
        const health = await HealthAIClient.healthCheck()
        if (health.status === 'healthy') {
            setAiStatus('connected')
        } else {
            setAiStatus('disconnected')
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isAnalyzing) return

        const userMessage: Message = {
            id: Date.now(),
            role: 'user',
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsAnalyzing(true)

        try {
            const response = await HealthAIClient.sendMessage(input)

            if (response.type === 'emergency') {
                setEmergencyAlert(response.content)
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'ai',
                    content: response.content,
                    timestamp: new Date()
                }])
            } else if (response.type === 'analysis' && response.analysis) {
                // Defensive coding: Ensure all required fields exist
                const safeAnalysis = {
                    ...response.analysis,
                    possible_causes: response.analysis.possible_causes || [],
                    recommendations: {
                        immediate: response.analysis.recommendations?.immediate || [],
                        within_24h: response.analysis.recommendations?.within_24h || [],
                        elective: response.analysis.recommendations?.elective || []
                    },
                    cost_estimate: {
                        with_insurance: response.analysis.cost_estimate?.with_insurance || "N/A",
                        without_insurance: response.analysis.cost_estimate?.without_insurance || "N/A"
                    }
                }
                setAnalysis(safeAnalysis as any) // Type assertion to handle the merge
                setConversationStage('analyzing')
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'ai',
                    content: response.content,
                    timestamp: new Date()
                }])
            } else {

                let combinedContent = response.content;
                if (response.follow_up) {
                    combinedContent += "\n\n" + response.follow_up;
                }

                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'ai',
                    content: combinedContent,
                    timestamp: new Date()
                }])
            }

            // Simple stage advancement logic
            if (messages.length >= 2 && conversationStage === 'greeting') {
                setConversationStage('exploring')
            }

        } catch (error) {
            console.error('Chat error:', error)
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                content: "I apologize, I'm having trouble processing that. Could you rephrase or try again?",
                timestamp: new Date()
            }])
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleQuickAction = (action: string) => {
        const actions: Record<string, string> = {
            'headache': 'I have a headache',
            'fever': 'I have fever and body aches',
            'cough': 'I have cough and cold symptoms',
            'pain': 'I have pain in my body',
            'stomach': 'I have stomach issues'
        }

        if (actions[action]) {
            setInput(actions[action])
        }
    }

    const resetConversation = async () => {
        await HealthAIClient.resetConversation()
        setMessages([{
            id: 1,
            role: 'ai',
            content: "👋 Hello! I'm HealthGuard AI. What symptoms are you experiencing today?",
            timestamp: new Date()
        }])
        setAnalysis(null)
        setEmergencyAlert(null)
        setConversationStage('greeting')
        setUserContext({ age: null, hasMedicalHistory: false, contextProvided: false })
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const stageIcons = {
        greeting: <MessageSquare className="w-4 h-4" />,
        exploring: <Stethoscope className="w-4 h-4" />,
        analyzing: <Brain className="w-4 h-4" />,
        followup: <User className="w-4 h-4" />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <Link to="/patient-dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium mb-2 inline-block">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">AI Symptom Checker</h1>
                        <p className="text-slate-600 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${aiStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {aiStatus === 'connected' ? 'AI Assistant Online' : 'Offline Mode'}
                        </p>
                    </div>
                    <button
                        onClick={resetConversation}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reset Chat
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 h-[700px]">
                    <div className="lg:col-span-2 flex flex-col h-full">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 flex flex-col h-full overflow-hidden">

                            <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-3 flex items-center gap-4 text-sm text-slate-500">
                                {Object.entries(stageIcons).map(([stage, icon]) => (
                                    <div
                                        key={stage}
                                        className={`flex items-center gap-1.5 ${conversationStage === stage ? 'text-indigo-600 font-semibold' : 'opacity-50'}`}
                                    >
                                        {icon}
                                        <span className="capitalize">{stage}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm ${message.role === 'user'
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
                                                : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                                                }`}
                                        >
                                            <p className="text-sm font-medium mb-1 opacity-80">
                                                {message.role === 'user' ? 'You' : 'HealthGuard AI'}
                                            </p>
                                            <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                    </div>
                                ))}

                                {isAnalyzing && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-slate-100 rounded-2xl px-6 py-4 rounded-bl-none shadow-sm">
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                                                <span className="font-medium">Analyzing symptoms...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {messages.length < 3 && (
                                <div className="px-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                                    <button onClick={() => handleQuickAction('fever')} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors whitespace-nowrap">
                                        <Thermometer className="w-4 h-4" /> Fever
                                    </button>
                                    <button onClick={() => handleQuickAction('headache')} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors whitespace-nowrap">
                                        <Brain className="w-4 h-4" /> Headache
                                    </button>
                                    <button onClick={() => handleQuickAction('stomach')} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors whitespace-nowrap">
                                        <Pill className="w-4 h-4" /> Stomach Pain
                                    </button>
                                </div>
                            )}

                            <div className="border-t border-slate-100 p-4 bg-white">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Describe your symptoms in detail..."
                                        className="flex-1 px-5 py-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-slate-50 focus:bg-white"
                                        disabled={isAnalyzing}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isAnalyzing}
                                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-200"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-full overflow-y-auto">
                        {emergencyAlert && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 animate-pulse">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-red-800">Emergency Detected</h3>
                                        <p className="text-sm text-red-700 mt-1">{emergencyAlert}</p>
                                        <button className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700">
                                            Call 911 Immediately
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {analysis ? (
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 bg-indigo-100 rounded-xl">
                                        <Brain className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">AI Analysis</h2>
                                        <p className="text-xs text-slate-500">Based on provided symptoms</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-2">Urgency Level</p>
                                    <div className={`px-4 py-3 rounded-xl font-bold text-center ${analysis.urgency === 'EMERGENCY' ? 'bg-red-100 text-red-700' :
                                        analysis.urgency === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                            analysis.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                        }`}>
                                        {analysis.urgency}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-2">Possible Causes</p>
                                    <ul className="space-y-2">
                                        {analysis.possible_causes.map((cause, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                                                <span className="text-indigo-600 mt-1">•</span>
                                                <span>{cause}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-2">Recommendations</p>
                                    <div className="space-y-2">
                                        {analysis.recommendations.immediate.length > 0 && (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                                <p className="text-xs font-bold text-red-700 mb-1">Immediate:</p>
                                                {analysis.recommendations.immediate.map((rec, i) => (
                                                    <p key={i} className="text-sm text-red-900">• {rec}</p>
                                                ))}
                                            </div>
                                        )}
                                        {analysis.recommendations.within_24h.length > 0 && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                                                <p className="text-xs font-bold text-yellow-700 mb-1">Within 24 hours:</p>
                                                {analysis.recommendations.within_24h.map((rec, i) => (
                                                    <p key={i} className="text-sm text-yellow-900">• {rec}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        View Nearby Facilities
                                    </button>
                                    <Link to="/doctor-finder">
                                        <button className="w-full bg-white border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                                            <Share2 className="w-5 h-5" />
                                            Share with Doctor
                                        </button>
                                    </Link>
                                    <button className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                                        <Save className="w-5 h-5" />
                                        Save Analysis
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20">
                                <h3 className="font-bold text-slate-900 mb-4">How it works</h3>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-600 font-bold">1.</span>
                                        <span>Describe your symptoms in detail</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-600 font-bold">2.</span>
                                        <span>Answer follow-up questions</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-600 font-bold">3.</span>
                                        <span>Get AI-powered analysis and recommendations</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-600 font-bold">4.</span>
                                        <span>View cost estimates and nearby facilities</span>
                                    </li>
                                </ul>

                                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                    <p className="text-xs text-yellow-800">
                                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                                        This is not a substitute for professional medical advice. In case of emergency, call 911.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
