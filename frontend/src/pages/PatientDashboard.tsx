import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Upload, DollarSign, UserSearch, FileText, Activity, Shield, QrCode, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchUserActivity, fetchHealthVault, type Activity as ActivityType, type HealthVaultItem } from '../services/api'

export default function PatientDashboard() {
    const { user } = useAuth()
    const [recentActivity, setRecentActivity] = useState<ActivityType[]>([])
    const [healthVault, setHealthVault] = useState<HealthVaultItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            if (!user) return

            try {
                setIsLoading(true)
                const [activityData, vaultData] = await Promise.all([
                    fetchUserActivity(user.user_id),
                    fetchHealthVault(user.user_id)
                ])
                setRecentActivity(activityData)
                setHealthVault(vaultData)
            } catch (err) {
                setError('Failed to load dashboard data')
                console.error('Error loading dashboard:', err)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [user])

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Please log in</h2>
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Go to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
                        Welcome back, {user.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-slate-600">Your health data is secure and under your control</p>
                </div>

                {isLoading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-slate-600">Loading your dashboard...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Quick Actions & Activity */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Link to="/symptom-checker">
                                        <button className="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/30 text-left group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Search className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg mb-1">Check Symptoms</h3>
                                                    <p className="text-sm text-blue-100">AI-powered analysis</p>
                                                </div>
                                            </div>
                                        </button>
                                    </Link>

                                    <Link to="/upload-record">
                                        <button className="w-full bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-green-500/30 text-left group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Upload className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg mb-1">Upload Record</h3>
                                                    <p className="text-sm text-green-100">Add to your vault</p>
                                                </div>
                                            </div>
                                        </button>
                                    </Link>

                                    <Link to="/bill-analysis">
                                        <button className="w-full bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-purple-500/30 text-left group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <DollarSign className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg mb-1">Check Medical Costs</h3>
                                                    <p className="text-sm text-purple-100">Analyze bills</p>
                                                </div>
                                            </div>
                                        </button>
                                    </Link>

                                    <Link to="/doctor-finder">
                                        <button className="w-full bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-orange-500/30 text-left group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <UserSearch className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg mb-1">Find a Doctor</h3>
                                                    <p className="text-sm text-orange-100">Search specialists</p>
                                                </div>
                                            </div>
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h2>
                                <div className="space-y-4">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                {activity.type === 'symptom' && <Activity className="w-5 h-5 text-indigo-600" />}
                                                {activity.type === 'bill' && <FileText className="w-5 h-5 text-indigo-600" />}
                                                {activity.type === 'access' && <Shield className="w-5 h-5 text-indigo-600" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900">{activity.text}</p>
                                                <p className="text-sm text-slate-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Health Vault & Emergency */}
                        <div className="space-y-6">
                            {/* Health Vault */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">My Health Vault</h2>
                                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                                        {healthVault.length} items
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {healthVault.map((item) => (
                                        <div key={item.id} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-slate-900">{item.name}</p>
                                                    <p className="text-sm text-slate-500">{item.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                                    View All Records
                                </button>
                            </div>

                            {/* Emergency Card */}
                            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-3xl shadow-xl p-8 border border-red-400/20">
                                <h2 className="text-2xl font-bold mb-4">Emergency Card</h2>
                                <p className="text-red-100 mb-6 text-sm">Quick access to critical health information</p>
                                <div className="space-y-3">
                                    <Link to="/emergency-qr">
                                        <button className="w-full bg-white text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                            <QrCode className="w-5 h-5" />
                                            Show Emergency QR
                                        </button>
                                    </Link>
                                    <button className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-bold hover:bg-white/30 transition-colors">
                                        Edit Contacts
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
