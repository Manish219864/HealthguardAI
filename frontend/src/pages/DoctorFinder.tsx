import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Star, DollarSign, CheckCircle, Share2, Calendar } from 'lucide-react'

interface Doctor {
    id: number
    name: string
    specialty: string
    rating: number
    reviews: number
    consultationFee: number
    distance: number
    inNetwork: boolean
    image: string
}

export default function DoctorFinder() {
    const [searchQuery, setSearchQuery] = useState('')
    const [location, setLocation] = useState('10001')
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
    const [showShareModal, setShowShareModal] = useState(false)

    const doctors: Doctor[] = [
        {
            id: 1,
            name: 'Dr. Lee Patel',
            specialty: 'Cardiology',
            rating: 5.0,
            reviews: 42,
            consultationFee: 300,
            distance: 2,
            inNetwork: true,
            image: '👨‍⚕️'
        },
        {
            id: 2,
            name: 'Dr. Sarah Chen',
            specialty: 'Cardiology',
            rating: 4.8,
            reviews: 38,
            consultationFee: 275,
            distance: 3.5,
            inNetwork: true,
            image: '👩‍⚕️'
        },
        {
            id: 3,
            name: 'Dr. Michael Rodriguez',
            specialty: 'Cardiology',
            rating: 4.9,
            reviews: 56,
            consultationFee: 350,
            distance: 5,
            inNetwork: false,
            image: '👨‍⚕️'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/patient-dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium mb-2 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Find a Doctor</h1>
                    <p className="text-slate-600">Search for specialists and share your medical records securely</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Specialty or Doctor Name</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cardiologist"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Location (ZIP Code)</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="10001"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    <button className="mt-4 w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
                        Search Doctors
                    </button>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Doctor Info */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                                            {doctor.image}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-slate-900 mb-1">{doctor.name}</h3>
                                            <p className="text-slate-600 font-medium mb-3">{doctor.specialty}</p>

                                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                                {/* Rating */}
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-5 h-5 ${i < Math.floor(doctor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                                                        />
                                                    ))}
                                                    <span className="ml-2 font-bold text-slate-900">{doctor.rating}</span>
                                                    <span className="text-slate-500 text-sm">({doctor.reviews} reviews)</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                {/* Consultation Fee */}
                                                <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                                                    <DollarSign className="w-4 h-4 text-purple-600" />
                                                    <span className="text-sm font-semibold text-purple-900">
                                                        Consultation: ${doctor.consultationFee}
                                                    </span>
                                                </div>

                                                {/* Distance */}
                                                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                                                    <MapPin className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm font-semibold text-blue-900">
                                                        {doctor.distance} miles away
                                                    </span>
                                                </div>

                                                {/* Insurance */}
                                                {doctor.inNetwork && (
                                                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm font-semibold text-green-900">
                                                            In-network with your insurance
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3 md:w-48">
                                    <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                                        View Profile
                                    </button>
                                    <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        Book Appointment
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedDoctor(doctor)
                                            setShowShareModal(true)
                                        }}
                                        className="bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Share Records
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Share Records Modal */}
            {showShareModal && selectedDoctor && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                Share Records with {selectedDoctor.name}
                            </h2>

                            {/* Record Selection */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-slate-700 mb-4">Select Records to Share</h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 1, name: 'ER Visit Report', date: 'Nov 15, 2024', checked: true },
                                        { id: 2, name: 'Recent EKG Results', date: 'Nov 15, 2024', checked: true },
                                        { id: 3, name: 'Lab Work', date: 'Oct 2024', checked: true },
                                        { id: 4, name: 'Prescription History', date: 'Sep 2024', checked: false },
                                        { id: 5, name: 'Insurance Details', date: 'Jan 2024', checked: false }
                                    ].map((record) => (
                                        <label key={record.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                            <input
                                                type="checkbox"
                                                defaultChecked={record.checked}
                                                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold text-slate-900">{record.name}</p>
                                                <p className="text-sm text-slate-500">{record.date}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Access Duration */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-slate-700 mb-4">Access Duration</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['7 days', '30 days', '90 days', 'Until revoked'].map((duration, index) => (
                                        <label key={duration} className="relative">
                                            <input
                                                type="radio"
                                                name="duration"
                                                defaultChecked={index === 3}
                                                className="peer sr-only"
                                            />
                                            <div className="p-3 text-center border-2 border-slate-200 rounded-xl cursor-pointer peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-900 hover:border-indigo-300 transition-all">
                                                <p className="font-semibold text-sm">{duration}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Blockchain Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                                <p className="text-sm text-blue-800 mb-2">
                                    <strong>🔐 Blockchain Transaction</strong>
                                </p>
                                <p className="text-xs text-blue-700">
                                    This action will create a blockchain transaction to grant access. Estimated gas fee: ~$0.15
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="flex-1 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        // Simulate MetaMask transaction
                                        alert('MetaMask transaction confirmed! Records shared with ' + selectedDoctor.name)
                                        setShowShareModal(false)
                                    }}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                                >
                                    Share with {selectedDoctor.name.split(' ')[1]}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
