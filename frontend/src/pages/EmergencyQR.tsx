import React from 'react'
import QRCode from 'react-qr-code'
import { Link } from 'react-router-dom'
import { Download, Share2, AlertCircle, Phone, Droplet, Pill } from 'lucide-react'

export default function EmergencyQR() {
    const [emergencyData] = React.useState(() => ({
        patientId: 'HG-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        name: 'Alex Johnson',
        bloodType: 'O+',
        allergies: ['Penicillin (Severe)'],
        currentMeds: ['Lipitor 20mg daily'],
        emergencyContact: {
            name: 'Sarah Johnson',
            phone: '(555) 123-4567',
            relationship: 'Spouse'
        },
        lastEKG: 'Oct 15, 2024'
    }))

    const emergencyUrl = `https://healthguard.app/emergency/${emergencyData.patientId}`

    const handleDownload = () => {
        // Create a canvas and download the QR code
        const svg = document.getElementById('emergency-qr-code')
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg)
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()
            img.onload = () => {
                canvas.width = img.width
                canvas.height = img.height
                ctx?.drawImage(img, 0, 0)
                const pngFile = canvas.toDataURL('image/png')
                const downloadLink = document.createElement('a')
                downloadLink.download = 'emergency-qr-code.png'
                downloadLink.href = pngFile
                downloadLink.click()
            }
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/patient-dashboard" className="text-red-600 hover:text-red-700 font-medium mb-2 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Emergency Access Card</h1>
                    <p className="text-slate-600">Quick access to critical health information for first responders</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* QR Code */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-bold mb-6">
                                <AlertCircle className="w-5 h-5" />
                                EMERGENCY ACCESS
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-lg inline-block mb-6">
                                <QRCode
                                    id="emergency-qr-code"
                                    value={emergencyUrl}
                                    size={256}
                                    level="H"
                                />
                            </div>

                            <p className="text-sm text-slate-600 mb-6">
                                Scan this QR code to access emergency medical information
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={handleDownload}
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download QR Code
                                </button>
                                <button className="w-full bg-white border-2 border-red-600 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                                    <Share2 className="w-5 h-5" />
                                    Share Emergency Card
                                </button>
                            </div>

                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <p className="text-xs text-yellow-800">
                                    💡 Print this QR code and keep it in your wallet or wear it as a bracelet
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Information */}
                    <div className="space-y-4">
                        {/* Critical Information */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Critical Information</h2>

                            <div className="space-y-4">
                                {/* Blood Type */}
                                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Droplet className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-600">Blood Type</p>
                                        <p className="text-lg font-bold text-slate-900">{emergencyData.bloodType}</p>
                                    </div>
                                </div>

                                {/* Allergies */}
                                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <AlertCircle className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-600">Allergies</p>
                                        {emergencyData.allergies.map((allergy, index) => (
                                            <p key={index} className="text-lg font-bold text-slate-900">{allergy}</p>
                                        ))}
                                    </div>
                                </div>

                                {/* Current Medications */}
                                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Pill className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-600">Current Medications</p>
                                        {emergencyData.currentMeds.map((med, index) => (
                                            <p key={index} className="text-lg font-bold text-slate-900">{med}</p>
                                        ))}
                                    </div>
                                </div>

                                {/* Last EKG */}
                                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-600">Last EKG</p>
                                        <p className="text-lg font-bold text-slate-900">{emergencyData.lastEKG}</p>
                                        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium mt-1">
                                            View →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Emergency Contact</h2>

                            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-bold text-slate-900">{emergencyData.emergencyContact.name}</p>
                                    <p className="text-sm text-slate-600">{emergencyData.emergencyContact.relationship}</p>
                                    <a href={`tel:${emergencyData.emergencyContact.phone}`} className="text-lg font-bold text-green-600 hover:text-green-700">
                                        {emergencyData.emergencyContact.phone}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">How Emergency Access Works</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
                                <span className="text-2xl font-bold text-indigo-600">1</span>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">First Responder Scans</h3>
                            <p className="text-sm text-slate-600">Emergency personnel scan your QR code with any smartphone</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
                                <span className="text-2xl font-bold text-indigo-600">2</span>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Instant Access</h3>
                            <p className="text-sm text-slate-600">Critical information displays immediately without login</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-3">
                                <span className="text-2xl font-bold text-indigo-600">3</span>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Logged on Blockchain</h3>
                            <p className="text-sm text-slate-600">All emergency access is recorded for your security</p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
