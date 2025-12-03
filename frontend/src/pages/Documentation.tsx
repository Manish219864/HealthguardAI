import { Link } from 'react-router-dom'
import { Book, Shield, Activity, FileText, Lock } from 'lucide-react'

export default function Documentation() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">HG</div>
                        <span className="font-bold text-xl text-slate-900">HealthGuard Docs</span>
                    </div>
                    <Link to="/">
                        <button className="text-slate-600 hover:text-blue-600 font-medium text-sm">
                            Back to App
                        </button>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="hidden lg:block space-y-8">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-4 px-2">Getting Started</h3>
                            <div className="space-y-1">
                                <a href="#overview" className="block px-2 py-1.5 text-blue-600 font-medium bg-blue-50 rounded-lg">Overview</a>
                                <a href="#authentication" className="block px-2 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">Authentication</a>
                                <a href="#onboarding" className="block px-2 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">Onboarding</a>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-4 px-2">Features</h3>
                            <div className="space-y-1">
                                <a href="#symptom-checker" className="block px-2 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">AI Symptom Checker</a>
                                <a href="#records" className="block px-2 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">Medical Records</a>
                                <a href="#emergency" className="block px-2 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">Emergency Access</a>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-12">
                        {/* Overview */}
                        <section id="overview">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                    <Book className="w-6 h-6" />
                                </div>
                                <h1 className="text-4xl font-extrabold text-slate-900">Documentation</h1>
                            </div>
                            <p className="text-xl text-slate-600 leading-relaxed mb-8">
                                HealthGuard AI is a decentralized healthcare platform that empowers patients with control over their medical data while providing advanced AI tools for health management.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <Shield className="w-8 h-8 text-indigo-600 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Privacy First</h3>
                                    <p className="text-slate-600">Your data is encrypted and stored on IPFS, secured by blockchain technology.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <Activity className="w-8 h-8 text-green-600 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">AI Powered</h3>
                                    <p className="text-slate-600">Advanced algorithms analyze symptoms and medical bills to provide actionable insights.</p>
                                </div>
                            </div>
                        </section>

                        {/* Authentication */}
                        <section id="authentication" className="pt-8 border-t border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Authentication</h2>
                            <p className="text-slate-600 mb-6">
                                HealthGuard supports two methods of authentication to bridge the gap between Web2 and Web3 users.
                            </p>
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-slate-900">Method</th>
                                            <th className="px-6 py-4 font-semibold text-slate-900">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr>
                                            <td className="px-6 py-4 font-medium text-slate-900">Connect Wallet</td>
                                            <td className="px-6 py-4 text-slate-600">Direct connection via MetaMask for Web3 natives.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-medium text-slate-900">Health ID</td>
                                            <td className="px-6 py-4 text-slate-600">Traditional email/password login with background wallet generation.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Security Note */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex gap-4">
                            <Lock className="w-6 h-6 text-yellow-700 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-yellow-900 mb-1">Security Notice</h4>
                                <p className="text-yellow-800 text-sm">
                                    This is a prototype application. In a production environment, all medical records would be encrypted before IPFS upload, and access keys would be managed via smart contracts.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
