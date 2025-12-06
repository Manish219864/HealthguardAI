import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { Wallet, UserPlus, Shield, Heart, Sparkles, Stethoscope } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { connectWallet, createHealthID, loginWithEmail } from '../services/api'

declare global {
    interface Window {
        ethereum?: unknown
    }
}

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [isDoctor, setIsDoctor] = useState(false)
    const [showCreateAccount, setShowCreateAccount] = useState(false)
    const [showEmailLogin, setShowEmailLogin] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dateOfBirth: ''
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleConnectWallet = async () => {
        setIsLoading(true)
        try {
            if (window.ethereum) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const provider = new ethers.BrowserProvider(window.ethereum as any)
                const signer = await provider.getSigner()
                const walletAddress = await signer.getAddress()

                const response = await connectWallet(walletAddress)
                navigate('/onboarding', {
                    state: {
                        walletAddress: response.wallet_address,
                        method: 'wallet'
                    }
                })
            } else {
                alert('Please install MetaMask to use wallet login')
                window.open('https://metamask.io/download/', '_blank')
            }
        } catch (error) {
            console.error('Wallet connection failed:', error)
            alert('Failed to connect wallet')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDoctorWalletLogin = async () => {
        setIsLoading(true)
        try {
            if (window.ethereum) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const provider = new ethers.BrowserProvider(window.ethereum as any)
                const signer = await provider.getSigner()
                const walletAddress = await signer.getAddress()

                console.log('Doctor logging in with wallet:', walletAddress)

                setTimeout(() => {
                    login({
                        user_id: 'doc_wallet_123',
                        name: 'Dr. Wallet User',
                        email: 'dr.wallet@healthguard.ai',
                        wallet_address: walletAddress,
                        date_of_birth: '',
                        phone: ''
                    })
                    navigate('/doctor-dashboard')
                    setIsLoading(false)
                }, 1500)
            } else {
                alert('Please install MetaMask to use wallet login')
                window.open('https://metamask.io/download/', '_blank')
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Doctor wallet login failed:', error)
            alert('Failed to connect wallet')
            setIsLoading(false)
        }
    }

    const handleCreateHealthID = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await createHealthID({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                date_of_birth: formData.dateOfBirth
            })

            login({
                user_id: response.user_id,
                name: formData.name,
                email: formData.email,
                wallet_address: response.wallet_address,
                date_of_birth: formData.dateOfBirth,
                phone: ''
            })

            navigate('/patient-dashboard')
        } catch (error) {
            console.error('Error creating account:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to create account'
            alert(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await loginWithEmail({
                email: formData.email,
                password: formData.password
            })

            login({
                user_id: response.user_id,
                name: 'User',
                email: formData.email,
                wallet_address: response.wallet_address,
                date_of_birth: '',
                phone: ''
            })

            navigate('/patient-dashboard')
        } catch (error) {
            console.error('Login failed:', error)
            const errorMessage = error instanceof Error ? error.message : 'Login failed'
            alert(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div >

            <div className="max-w-md w-full relative z-10">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr ${isDoctor ? 'from-green-600 to-teal-600' : 'from-blue-600 to-indigo-600'} rounded-3xl mb-4 shadow-2xl transition-colors duration-500`}>
                        {isDoctor ? <Stethoscope className="w-10 h-10 text-white" /> : <Heart className="w-10 h-10 text-white" fill="white" />}
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">HealthGuard AI</h1>
                    <p className="text-lg text-slate-600 font-medium">
                        {isDoctor ? 'Provider Portal' : 'Take Control of Your Health'}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">AI-Powered, Privacy-First Healthcare</p>
                </div>

                {/* Doctor Toggle */}
                {!showCreateAccount && (
                    <div className="flex justify-center mb-8">
                        <div className="bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-white/20 flex shadow-sm">
                            <button
                                onClick={() => setIsDoctor(false)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isDoctor ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Patient
                            </button>
                            <button
                                onClick={() => setIsDoctor(true)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isDoctor ? 'bg-white text-green-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Doctor
                            </button>
                        </div>
                    </div>
                )}

                {!showCreateAccount ? (
                    !showEmailLogin ? (

                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                            <div className="space-y-4">
                                {isDoctor ? (

                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        setIsLoading(true)
                                        setTimeout(() => {
                                            login({
                                                user_id: 'doc_123',
                                                name: 'Dr. Sarah Lee',
                                                email: 'dr.lee@healthguard.ai',
                                                wallet_address: '',
                                                date_of_birth: '',
                                                phone: ''
                                            })
                                            navigate('/doctor-dashboard')
                                            setIsLoading(false)
                                        }, 1500)
                                    }} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Medical License ID</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                                                placeholder="MD-12345-678"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-green-700 hover:to-teal-700 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-green-500/30 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'Verifying Credentials...' : 'Access Portal'}
                                        </button>

                                        <div className="relative py-4">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-slate-200"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-4 bg-white text-slate-500 font-medium">or</span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleDoctorWalletLogin}
                                            disabled={isLoading}
                                            className="w-full bg-white text-slate-900 border-2 border-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all hover:border-green-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Wallet className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <span className="text-lg">Login with MetaMask</span>
                                        </button>
                                        <div className="text-center mt-4">
                                            <p className="text-sm text-slate-600">
                                                New provider?{' '}
                                                <button
                                                    type="button"
                                                    onClick={() => navigate('/doctor-registration')}
                                                    className="text-green-600 font-bold hover:text-green-700 hover:underline"
                                                >
                                                    Register as Provider
                                                </button>
                                            </p>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        {/* Connect Wallet Button */}
                                        <button
                                            onClick={handleConnectWallet}
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-orange-500/30 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22.0002 14.45L21.0502 3.75L12.0002 13.25L2.9502 3.75L2.0002 14.45L12.0002 20.25L22.0002 14.45Z" fill="#E2761B" stroke="#E2761B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M2.9502 3.75L5.7502 13.25L12.0002 13.25L18.2502 13.25L21.0502 3.75L12.0002 8.75L2.9502 3.75Z" fill="#E4761B" stroke="#E4761B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span className="text-lg">{isLoading ? 'Connecting...' : 'Connect MetaMask'}</span>
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
                                            disabled={isLoading}
                                            className="w-full bg-white text-slate-900 border-2 border-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all hover:border-indigo-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform text-indigo-600" />
                                            <span className="text-lg">Create Health ID</span>
                                        </button>

                                        {/* Email Login Link */}
                                        <div className="text-center mt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowEmailLogin(true)}
                                                className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline text-sm"
                                            >
                                                Login with Email
                                            </button>
                                        </div>
                                    </>
                                )}
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

                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                            <button
                                onClick={() => setShowEmailLogin(false)}
                                className="text-slate-600 hover:text-slate-900 mb-4 flex items-center gap-2 text-sm font-medium"
                            >
                                ← Back to login options
                            </button>

                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Welcome Back</h2>

                            <form onSubmit={handleEmailLogin} className="space-y-4">
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

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-blue-500/30 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </button>
                            </form>
                        </div>
                    )
                ) : (

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
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-blue-500/30 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Footer */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div >
    )
}
