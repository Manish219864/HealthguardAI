import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, UserPlus, Shield, Heart, Sparkles } from 'lucide-react'

export default function Login() {
    const navigate = useNavigate()
    const [showCreateAccount, setShowCreateAccount] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dateOfBirth: ''
    })

    const handleConnectWallet = async () => {
        // Simulated MetaMask connection
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                console.log('Connected:', accounts[0])
                // Navigate to onboarding
                navigate('/onboarding', { state: { walletAddress: accounts[0], method: 'wallet' } })
            } catch (error) {
                console.error('Error connecting wallet:', error)
                alert('Please install MetaMask to use wallet login')
            }
        } else {
            // Simulate wallet connection for demo
            const mockAddress = '0x' + Math.random().toString(16).substr(2, 40)
            navigate('/onboarding', { state: { walletAddress: mockAddress, method: 'wallet' } })
        }
    }

    const handleCreateHealthID = (e: React.FormEvent) => {
        e.preventDefault()
        // Simulate account creation with background wallet generation
        const mockWalletAddress = '0x' + Math.random().toString(16).substr(2, 40)
        navigate('/onboarding', {
            state: {
                walletAddress: mockWalletAddress,
                method: 'healthid',
                userData: formData
            }
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl mb-4 shadow-2xl">
                        <Heart className="w-10 h-10 text-white" fill="white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">HealthGuard AI</h1>
                    <p className="text-lg text-slate-600 font-medium">Take Control of Your Health</p>
                    <p className="text-sm text-slate-500 mt-1">AI-Powered, Privacy-First Healthcare</p>
                </div>

                {!showCreateAccount ? (
                    // Login Options
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                        <div className="space-y-4">
                            {/* Connect Wallet Button */}
                            <button
                                onClick={handleConnectWallet}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-3 group"
                            >
                                <Wallet className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <span className="text-lg">Connect Wallet</span>
                            </button>

                            {/* Divider */}
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-slate-500 font-medium">or</span>
                                </div>
                            </div>

                            {/* Create Health ID Button */}
                            <button
                                onClick={() => setShowCreateAccount(true)}
                                className="w-full bg-white text-slate-900 border-2 border-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all hover:border-indigo-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                            >
                                <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform text-indigo-600" />
                                <span className="text-lg">Create Health ID</span>
                            </button>
                        </div>

                        {/* Features */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Shield className="w-5 h-5 text-green-600" />
                                    <span>Your data, your control</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Sparkles className="w-5 h-5 text-purple-600" />
                                    <span>AI-powered health insights</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Heart className="w-5 h-5 text-red-600" />
                                    <span>Emergency access when you need it</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Create Account Form
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                        <button
                            onClick={() => setShowCreateAccount(false)}
                            className="text-slate-600 hover:text-slate-900 mb-4 flex items-center gap-2 text-sm font-medium"
                        >
                            ← Back to login options
                        </button>

                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Your Health ID</h2>

                        <form onSubmit={handleCreateHealthID} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                    placeholder="Alex Johnson"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                    placeholder="alex@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                                />
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                                <p className="text-xs text-blue-800">
                                    <Shield className="w-4 h-4 inline mr-1" />
                                    A secure wallet will be created for you automatically. You'll receive your wallet details after registration.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-blue-500/30 mt-6"
                            >
                                Create Account
                            </button>
                        </form>
                    </div>
                )}

                {/* Footer */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    )
}
