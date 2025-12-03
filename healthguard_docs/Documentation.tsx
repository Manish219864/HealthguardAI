export default function Documentation() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                    Documentation
                </h1>
                <p className="text-xl text-slate-600 mb-12">
                    Learn how to use HealthGuard AI to manage your healthcare journey.
                </p>

                {/* Getting Started */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="text-blue-600">🚀</span>
                        Getting Started
                    </h2>
                    <div className="prose prose-slate max-w-none">
                        <p className="text-slate-700 leading-relaxed mb-4">
                            HealthGuard AI is a decentralized health platform that combines artificial intelligence with blockchain technology to provide:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                            <li>AI-powered symptom analysis and cost estimation</li>
                            <li>Secure blockchain-based health records</li>
                            <li>Smart contract-enabled insurance claims</li>
                            <li>HSA/FSA fund management</li>
                        </ul>
                    </div>
                </section>

                {/* Features */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <span className="text-indigo-600">⚡</span>
                        Key Features
                    </h2>

                    <div className="space-y-6">
                        {/* AI Navigator */}
                        <div className="border-l-4 border-blue-500 pl-6 py-2">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Navigator</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Our advanced AI system analyzes your symptoms and provides personalized health recommendations.
                                It also estimates treatment costs based on your location and insurance coverage.
                            </p>
                        </div>

                        {/* Smart Wallet */}
                        <div className="border-l-4 border-green-500 pl-6 py-2">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Smart Wallet</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Manage your HSA/FSA funds and process insurance claims instantly using blockchain smart contracts.
                                Enjoy transparent, automated, and secure financial transactions.
                            </p>
                        </div>

                        {/* Health Vault */}
                        <div className="border-l-4 border-purple-500 pl-6 py-2">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Health Vault</h3>
                            <p className="text-slate-700 leading-relaxed">
                                Your medical records are encrypted and stored securely on the blockchain.
                                You have complete control over who can access your health data.
                            </p>
                        </div>
                    </div>
                </section>

                {/* API Reference */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="text-purple-600">📚</span>
                        API Reference
                    </h2>
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <p className="text-slate-700 mb-4">
                            The HealthGuard AI backend API is built with FastAPI and provides the following endpoints:
                        </p>
                        <div className="space-y-3">
                            <div className="bg-white rounded-lg p-4 border border-slate-200">
                                <code className="text-sm font-mono text-blue-600">GET /api/health</code>
                                <p className="text-slate-600 mt-2">Health check endpoint to verify API status</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-slate-200">
                                <code className="text-sm font-mono text-blue-600">GET /docs</code>
                                <p className="text-slate-600 mt-2">Interactive API documentation (Swagger UI)</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tech Stack */}
                <section>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                        <span className="text-green-600">🛠️</span>
                        Technology Stack
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Frontend</h3>
                            <ul className="space-y-2 text-slate-700">
                                <li>• React 19 with TypeScript</li>
                                <li>• Tailwind CSS v4</li>
                                <li>• Vite for build tooling</li>
                                <li>• React Router for navigation</li>
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Backend</h3>
                            <ul className="space-y-2 text-slate-700">
                                <li>• FastAPI (Python)</li>
                                <li>• SQLAlchemy for database</li>
                                <li>• Web3 for blockchain integration</li>
                                <li>• LangChain for AI features</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
