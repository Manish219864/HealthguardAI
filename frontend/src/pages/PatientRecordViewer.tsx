import { Link } from 'react-router-dom'
import { FileText, AlertCircle, Pill, Activity, Calendar, MessageSquare, Download } from 'lucide-react'

export default function PatientRecordViewer() {


    const patientData = {
        name: 'Alex Johnson',
        age: 30,
        gender: 'Male',
        bloodType: 'O+',
        allergies: ['Penicillin (Severe)'],
        currentMeds: ['Lipitor 20mg daily'],
        recentVisits: [
            { id: 1, date: 'Nov 15, 2024', type: 'ER Visit', reason: 'Chest pain' },
            { id: 2, date: 'Oct 10, 2024', type: 'Primary Care', reason: 'Annual checkup' }
        ],
        availableRecords: [
            { id: 1, name: 'ER Discharge Summary', date: 'Nov 15, 2024', type: 'PDF', size: '245 KB' },
            { id: 2, name: 'EKG Results', date: 'Nov 15, 2024', type: 'PDF', size: '1.2 MB' },
            { id: 3, name: 'Lab Work', date: 'Nov 15, 2024', type: 'PDF', size: '180 KB' },
            { id: 4, name: 'Previous EKG', date: 'Oct 15, 2024', type: 'PDF', size: '1.1 MB' }
        ]
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/doctor-dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium mb-2 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Patient Record</h1>
                    <p className="text-slate-600">Secure access to patient medical information</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Patient Overview */}
                    <div className="space-y-6">
                        {/* Patient Info */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4 mx-auto">
                                {patientData.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 text-center mb-1">{patientData.name}</h2>
                            <p className="text-slate-600 text-center mb-6">{patientData.age} years old • {patientData.gender}</p>

                            <div className="space-y-3">
                                <div className="p-3 bg-red-50 rounded-xl">
                                    <p className="text-xs font-semibold text-slate-600 mb-1">Blood Type</p>
                                    <p className="text-lg font-bold text-slate-900">{patientData.bloodType}</p>
                                </div>
                            </div>
                        </div>

                        {/* Medical Alerts */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                                Medical Alerts
                            </h3>

                            <div className="space-y-3">
                                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                                    <p className="text-sm font-semibold text-orange-900 mb-2">Allergies</p>
                                    {patientData.allergies.map((allergy, index) => (
                                        <p key={index} className="text-sm text-orange-800 font-medium">{allergy}</p>
                                    ))}
                                </div>

                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                        <Pill className="w-4 h-4" />
                                        Current Medications
                                    </p>
                                    {patientData.currentMeds.map((med, index) => (
                                        <p key={index} className="text-sm text-blue-800 font-medium">{med}</p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl shadow-xl p-6">
                            <h3 className="font-bold mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Send Message
                                </button>
                                <button className="w-full bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Schedule Follow-up
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Records & History */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Visits */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Activity className="w-7 h-7 text-green-600" />
                                Recent Visits
                            </h2>
                            <div className="space-y-3">
                                {patientData.recentVisits.map((visit) => (
                                    <div key={visit.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-slate-900">{visit.type}</p>
                                                <p className="text-sm text-slate-600">{visit.reason}</p>
                                            </div>
                                            <p className="text-sm text-slate-500">{visit.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                                View Full Timeline →
                            </button>
                        </div>

                        {/* Available Records */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <FileText className="w-7 h-7 text-blue-600" />
                                Available Records
                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                {patientData.availableRecords.map((record) => (
                                    <div key={record.id} className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group">
                                        <div className="flex items-start gap-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                                                <FileText className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-900 mb-1 truncate">{record.name}</p>
                                                <p className="text-xs text-slate-500 mb-2">{record.date}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-medium">
                                                        {record.type}
                                                    </span>
                                                    <span className="text-xs text-slate-500">{record.size}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm flex items-center justify-center gap-2">
                                            <Download className="w-4 h-4" />
                                            View Document
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
                                    Compare EKGs
                                </button>
                                <button className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                                    Add Clinical Notes
                                </button>
                            </div>
                        </div>

                        {/* Access Log */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Access Log</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <span className="text-slate-700">You accessed records</span>
                                    <span className="text-slate-500">Just now</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-slate-700">Patient shared records</span>
                                    <span className="text-slate-500">2 hours ago</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-4">
                                🔒 All access is logged on the blockchain for security and compliance
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
