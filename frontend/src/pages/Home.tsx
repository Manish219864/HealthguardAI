import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-24 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                        Prototype Live
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight drop-shadow-sm">
                        Your Health, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Decentralized & Intelligent.</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-12 leading-relaxed">
                        Experience the future of healthcare with AI-powered symptom checking, transparent cost estimation, and secure blockchain records.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/login">
                            <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-blue-500/30 text-lg">
                                Get Started
                            </button>
                        </Link>
                        <Link to="/documentation">
                            <button className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all hover:border-slate-300 shadow-sm hover:shadow-md text-lg">
                                View Documentation
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Decorative blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[45rem] h-[45rem] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[45rem] h-[45rem] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-[-20%] left-[20%] w-[45rem] h-[45rem] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white/50 backdrop-blur-sm rounded-3xl mb-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 group cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500"></div>
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300 relative z-10">
                            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🤖</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">AI Navigator</h3>
                        <p className="text-slate-600 leading-relaxed relative z-10">
                            Advanced symptom checker and predictive cost analysis for your healthcare journey.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 group cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500"></div>
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300 relative z-10">
                            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">💳</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">Smart Wallet</h3>
                        <p className="text-slate-600 leading-relaxed relative z-10">
                            Manage HSA/FSA funds and process claims instantly with smart contracts.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 group cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500"></div>
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300 relative z-10">
                            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🔐</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">Health Vault</h3>
                        <p className="text-slate-600 leading-relaxed relative z-10">
                            Your medical records, encrypted and stored securely on the blockchain.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
