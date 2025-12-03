import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle2, Circle, Users, FileText, CreditCard, User, ArrowRight } from 'lucide-react'

export default function Onboarding() {
    const navigate = useNavigate()
    const location = useLocation()
    const { walletAddress, method, userData } = location.state || {}

    const [currentStep, setCurrentStep] = useState(0)
    const [checklist, setChecklist] = useState({
        emergencyContacts: false,
        medicalRecords: false,
        insurance: false,
        healthProfile: false
    })

    const [emergencyContact, setEmergencyContact] = useState({
        name: '',
        relationship: '',
        phone: ''
    })

    const [healthProfile, setHealthProfile] = useState({
        bloodType: '',
        allergies: '',
        currentMedications: '',
        chronicConditions: ''
    })

    const steps = [
        { id: 'emergency', title: 'Emergency Contacts', icon: Users },
        { id: 'records', title: 'Medical Records', icon: FileText },
        { id: 'insurance', title: 'Insurance Info', icon: CreditCard },
        { id: 'profile', title: 'Health Profile', icon: User }
    ]

    const handleSkipStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            navigate('/patient-dashboard')
        }
    }

    const handleCompleteStep = () => {
        const stepId = steps[currentStep].id
        setChecklist({ ...checklist, [stepId === 'emergency' ? 'emergencyContacts' : stepId === 'records' ? 'medicalRecords' : stepId === 'insurance' ? 'insurance' : 'healthProfile']: true })

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            navigate('/patient-dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            <div className="max-w-4xl mx-auto py-8">
                {/* Welcome Message */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-6 border border-white/20">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-4">
                            <CheckCircle2 className="w-5 h-5" />
                            Account Connected
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                            Welcome, {userData?.name || 'User'}!
                        </h1>
                        <p className="text-slate-600 mb-4">Your health data is now under your control</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 inline-block">
                            <p className="text-xs text-blue-800 font-mono">
                                Wallet: {walletAddress?.substring(0, 10)}...{walletAddress?.substring(walletAddress.length - 8)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 mb-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Complete Your Profile</h2>

                    {/* Step Indicators */}
                    <div className="flex items-center justify-between mb-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const isActive = index === currentStep
                            const isCompleted = index < currentStep || Object.values(checklist)[index]

                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-green-500 text-white' :
                                                isActive ? 'bg-indigo-600 text-white' :
                                                    'bg-slate-200 text-slate-400'
                                            }`}>
                                            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                        </div>
                                        <p className={`text-xs mt-2 font-medium ${isActive ? 'text-indigo-600' : 'text-slate-600'}`}>
                                            {step.title}
                                        </p>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`h-1 flex-1 mx-2 rounded ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}`} />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* Step Content */}
                    <div className="min-h-[300px]">
                        {currentStep === 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Set Up Emergency Contacts</h3>
                                <p className="text-slate-600 mb-6">Add someone who can be reached in case of emergency</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Name</label>
                                        <input
                                            type="text"
                                            value={emergencyContact.name}
                                            onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                            placeholder="Sarah Johnson"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Relationship</label>
                                        <input
                                            type="text"
                                            value={emergencyContact.relationship}
                                            onChange={(e) => setEmergencyContact({ ...emergencyContact, relationship: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                            placeholder="Spouse"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={emergencyContact.phone}
                                            onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Upload Existing Medical Records</h3>
                                <p className="text-slate-600 mb-6">Add your previous medical records to your secure vault</p>

                                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                    <p className="text-slate-600 font-medium mb-2">Drag and drop files here</p>
                                    <p className="text-sm text-slate-500 mb-4">or click to browse</p>
                                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                        Choose Files
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Add Insurance Information</h3>
                                <p className="text-slate-600 mb-6">Store your insurance details for easy access</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Insurance Provider</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                            placeholder="Blue Cross Blue Shield"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Policy Number</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                            placeholder="ABC123456789"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Group Number</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                            placeholder="GRP789"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Complete Health Profile</h3>
                                <p className="text-slate-600 mb-6">This information helps in emergencies</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Blood Type</label>
                                        <select
                                            value={healthProfile.bloodType}
                                            onChange={(e) => setHealthProfile({ ...healthProfile, bloodType: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                        >
                                            <option value="">Select blood type</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Allergies</label>
                                        <input
                                            type="text"
                                            value={healthProfile.allergies}
                                            onChange={(e) => setHealthProfile({ ...healthProfile, allergies: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                            placeholder="Penicillin, Peanuts"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Current Medications</label>
                                        <input
                                            type="text"
                                            value={healthProfile.currentMedications}
                                            onChange={(e) => setHealthProfile({ ...healthProfile, currentMedications: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                            placeholder="Lipitor 20mg daily"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Chronic Conditions</label>
                                        <input
                                            type="text"
                                            value={healthProfile.chronicConditions}
                                            onChange={(e) => setHealthProfile({ ...healthProfile, chronicConditions: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                            placeholder="Hypertension, Diabetes"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                        <button
                            onClick={handleSkipStep}
                            className="text-slate-600 hover:text-slate-900 font-medium px-6 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            Skip for now
                        </button>
                        <button
                            onClick={handleCompleteStep}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
