import { useState, useRef, useEffect } from 'react'
import { Send, AlertTriangle, MapPin, Save, Share2, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Message {
    id: number
    role: 'user' | 'ai'
    content: string
    timestamp: Date
}

interface Analysis {
    urgency: 'LOW' | 'MEDIUM' | 'HIGH'
    possibleCauses: string[]
    recommendation: string
    estimatedCost: string
}

export default function SymptomChecker() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: 'ai',
            content: "Hi Alex, describe your symptoms in your own words.",
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState<Analysis | null>(null)
    const [conversationStep, setConversationStep] = useState(0)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const simulateAIResponse = async (userMessage: string, step: number) => {
        setIsAnalyzing(true)

        // Simulate thinking delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        let aiResponse = ''

        if (step === 0) {
            aiResponse = "I understand this is worrying. How long have you had these symptoms?"
        } else if (step === 1) {
            aiResponse = "Any dizziness or nausea?"
        } else if (step === 2) {
            // Final analysis
            const analysisResult: Analysis = {
                urgency: 'HIGH',
                possibleCauses: [
                    'Anxiety/panic attack',
                    'Cardiac concern',
                    'Pulmonary issue'
                ],
                recommendation: 'ER Visit',
                estimatedCost: '$2,000-5,000'
            }
            setAnalysis(analysisResult)
            aiResponse = "Thank you for providing that information. I've completed my analysis."
        }

        setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'ai',
            content: aiResponse,
            timestamp: new Date()
        }])

        setIsAnalyzing(false)
        setConversationStep(step + 1)
    }

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now(),
            role: 'user',
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')

        await simulateAIResponse(input, conversationStep)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/patient-dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium mb-2 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">AI Symptom Checker</h1>
                    <p className="text-slate-600">Get instant analysis and recommendations</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Chat Interface */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 flex flex-col h-[600px]">
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-6 py-4 ${message.role === 'user'
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                                    : 'bg-slate-100 text-slate-900'
                                                }`}
                                        >
                                            <p className="text-sm font-medium mb-1">
                                                {message.role === 'user' ? 'You' : 'AI Assistant'}
                                            </p>
                                            <p>{message.content}</p>
                                        </div>
                                    </div>
                                ))}

                                {isAnalyzing && (
                                    <div className="flex justify-start">
                                        <div className="bg-slate-100 rounded-2xl px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Analyzing...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="border-t border-slate-200 p-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Describe your symptoms..."
                                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                        disabled={isAnalyzing || analysis !== null}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isAnalyzing || analysis !== null}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Panel */}
                    <div>
                        {analysis ? (
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20">
                                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                                    Final Analysis
                                </h2>

                                {/* Urgency Level */}
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-slate-600 mb-2">Urgency Level</p>
                                    <div className={`px-4 py-3 rounded-xl font-bold text-center ${analysis.urgency === 'HIGH' ? 'bg-red-100 text-red-700' :
                                            analysis.urgency === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
                                                'bg-green-100 text-green-700'
                                        }`}>
                                        {analysis.urgency}
                                    </div>
                                </div>

                                {/* Possible Causes */}
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-slate-600 mb-2">Possible Causes</p>
                                    <ul className="space-y-2">
                                        {analysis.possibleCauses.map((cause, index) => (
                                            <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                                                <span className="text-indigo-600 mt-1">•</span>
                                                <span>{cause}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Recommendation */}
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-slate-600 mb-2">Recommended Action</p>
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <p className="font-bold text-blue-900 flex items-center gap-2">
                                            🏥 {analysis.recommendation}
                                        </p>
                                    </div>
                                </div>

                                {/* Cost Estimate */}
                                <div className="mb-6">
                                    <p className="text-sm font-semibold text-slate-600 mb-2">Estimated Cost</p>
                                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                        <p className="font-bold text-purple-900 flex items-center gap-2">
                                            💰 {analysis.estimatedCost}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-2">
                                    <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        View Nearby ERs
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
