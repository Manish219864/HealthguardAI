import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, Shield, Clock, FileText, AlertCircle, User, MapPin, Stethoscope, Save } from 'lucide-react'

export default function DoctorDashboard() {
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [doctorProfile, setDoctorProfile] = useState({
        name: 'Dr. Sarah Lee',
        specialty: 'Cardiology',
        hospital: 'City General Hospital',
        availability: 'Mon-Fri, 9AM - 5PM',
        bio: 'Experienced cardiologist with over 15 years of practice specializing in preventative care.'
    })
    const appointments = [
        { id: 1, time: '10:00 AM', patient: 'Alex Johnson', status: 'new', hasRecords: true },
        { id: 2, time: '2:00 PM', patient: 'Maria Gonzalez', status: 'returning', hasRecords: false },
        { id: 3, time: '4:30 PM', patient: 'Robert Chen', status: 'returning', hasRecords: false }
    ]

    const recentlyAccessed = [
        { id: 1, patient: 'Alex Johnson', time: 'Just now', records: 3 },
        { id: 2, patient: 'Sarah Williams', time: '2 hours ago', records: 5 }
    ]

    const pendingRequests = [
        { id: 1, patient: 'Michael Brown', requestedAt: '1 hour ago' },
        { id: 2, patient: 'Jessica Taylor', requestedAt: '3 hours ago' }
    ]

    const emergencyAccess = [
        { id: 1, patient: 'John Doe', time: 'Today 8:30 AM', reason: 'ER Visit' },
        { id: 2, patient: 'Jane Smith', time: 'Yesterday 3:15 PM', reason: 'Urgent Care' },
        { id: 3, patient: 'Bob Wilson', time: 'Yesterday 11:00 AM', reason: 'ER Visit' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{doctorProfile.name}'s HealthGuard Pro</h1>
                        <p className="text-slate-600">Manage your patients and access medical records securely</p>
                    </div>
                    <button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <User className="w-4 h-4" />
                        {isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}
                    </button>
                </div>

                {isEditingProfile && (
                    <div className="mb-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Stethoscope className="w-7 h-7 text-green-600" />
                                Edit Public Profile
                            </h2>
                            <button
                                onClick={() => setIsEditingProfile(false)}
                                className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-green-500/30"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={doctorProfile.name}
                                    onChange={(e) => setDoctorProfile({ ...doctorProfile, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Specialty</label>
                                <input
                                    type="text"
                                    value={doctorProfile.specialty}
                                    onChange={(e) => setDoctorProfile({ ...doctorProfile, specialty: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Hospital / Clinic</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={doctorProfile.hospital}
                                        onChange={(e) => setDoctorProfile({ ...doctorProfile, hospital: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Availability</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={doctorProfile.availability}
                                        onChange={(e) => setDoctorProfile({ ...doctorProfile, availability: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                                <textarea
                                    value={doctorProfile.bio}
                                    onChange={(e) => setDoctorProfile({ ...doctorProfile, bio: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all h-24 resize-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Appointments & Requests */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Today's Appointments */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <Calendar className="w-7 h-7 text-indigo-600" />
                                    Today's Appointments
                                </h2>
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                                    {appointments.length} patients
                                </span>
                            </div>

                            <div className="space-y-3">
                                {appointments.map((appointment) => (
                                    <Link key={appointment.id} to={`/patient-record/${appointment.id}`}>
                                        <div className="p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100 hover:border-indigo-200">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                                                        {appointment.patient.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-lg">{appointment.patient}</p>
                                                        <p className="text-sm text-slate-600 flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            {appointment.time}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {appointment.status === 'new' && (
                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                            ⭐ New patient
                                                        </span>
                                                    )}
                                                    {appointment.hasRecords && (
                                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                                            Records shared
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recently Accessed */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <FileText className="w-7 h-7 text-purple-600" />
                                Patient Records Accessed Recently
                            </h2>
                            <div className="space-y-3">
                                {recentlyAccessed.map((access) => (
                                    <Link key={access.id} to={`/patient-record/${access.id}`}>
                                        <div className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-slate-900">{access.patient}</p>
                                                    <p className="text-sm text-slate-600">{access.records} records available</p>
                                                </div>
                                                <p className="text-sm text-slate-500">{access.time}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Pending Access Requests */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <Users className="w-7 h-7 text-orange-600" />
                                    Pending Access Requests
                                </h2>
                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                                    {pendingRequests.length} new
                                </span>
                            </div>
                            <div className="space-y-3">
                                {pendingRequests.map((request) => (
                                    <div key={request.id} className="p-4 bg-orange-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="font-bold text-slate-900">{request.patient}</p>
                                                <p className="text-sm text-slate-600">Requested {request.requestedAt}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm">
                                                Accept
                                            </button>
                                            <button className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-300 transition-colors text-sm">
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Emergency Access */}
                    <div>
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Shield className="w-6 h-6 text-red-600" />
                                    Emergency Access Logs
                                </h2>
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {emergencyAccess.length} this week
                                </span>
                            </div>

                            <div className="space-y-3">
                                {emergencyAccess.map((log) => (
                                    <div key={log.id} className="p-4 bg-red-50 border border-red-100 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-900 text-sm">{log.patient}</p>
                                                <p className="text-xs text-slate-600 mb-1">{log.reason}</p>
                                                <p className="text-xs text-slate-500">{log.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <p className="text-xs text-blue-800">
                                    <Shield className="w-4 h-4 inline mr-1" />
                                    All emergency accesses are logged on the blockchain for security and compliance
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl shadow-xl p-6">
                            <h3 className="font-bold mb-4">This Week</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-indigo-100">Total Patients</span>
                                    <span className="text-2xl font-bold">24</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-indigo-100">Records Accessed</span>
                                    <span className="text-2xl font-bold">67</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-indigo-100">Avg. Response Time</span>
                                    <span className="text-2xl font-bold">12m</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
