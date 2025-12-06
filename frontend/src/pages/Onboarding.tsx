import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle2, Users, FileText, CreditCard, User, ArrowRight, X, Heart } from 'lucide-react'
import { updateUserProfile, uploadRecord } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Onboarding() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()
    const { walletAddress, userData } = location.state || {}

    const [currentStep, setCurrentStep] = useState(0)
    const [personalInfo, setPersonalInfo] = useState({
        name: userData?.name || '',
        dateOfBirth: '',
        phone: ''
    })
    const [checklist, setChecklist] = useState({
        personalInfo: false,
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

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const steps = [
        { id: 'personal', title: 'Personal Info', icon: User },
        { id: 'emergency', title: 'Emergency Contacts', icon: Users },
        { id: 'records', title: 'Medical Records', icon: FileText },
        { id: 'insurance', title: 'Insurance Info', icon: CreditCard },
        { id: 'profile', title: 'Health Profile', icon: Heart }
    ]

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setUploadedFiles([...uploadedFiles, ...newFiles])
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files)
            setUploadedFiles([...uploadedFiles, ...newFiles])
        }
    }

    const handleRemoveFile = (index: number) => {
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
    }

    const handleSkipStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            navigate('/patient-dashboard')
        }
    }

    const handleCompleteStep = async () => {
        const stepId = steps[currentStep].id
        setChecklist({
            ...checklist,
            [stepId === 'personal' ? 'personalInfo' :
                stepId === 'emergency' ? 'emergencyContacts' :
                    stepId === 'records' ? 'medicalRecords' :
                        stepId === 'insurance' ? 'insurance' : 'healthProfile']: true
        })

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            const userId = `user_${walletAddress ? walletAddress.substring(2, 10) : 'new'}`
            login({
                user_id: userId,
                name: personalInfo.name || 'User',
                email: '',
                wallet_address: walletAddress,
                date_of_birth: personalInfo.dateOfBirth,
                phone: personalInfo.phone
            })

            try {
                await updateUserProfile(userId, {
                    name: personalInfo.name,
                    date_of_birth: personalInfo.dateOfBirth,
                    phone: personalInfo.phone,
                    blood_type: healthProfile.bloodType,
                    allergies: healthProfile.allergies,
                    medications: healthProfile.currentMedications,
                    chronic_conditions: healthProfile.chronicConditions
                })

                for (const file of uploadedFiles) {
                    await uploadRecord(file, userId)
                }

            } catch (error) {
                console.error("Error saving profile:", error)
            }

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
                            Welcome, {personalInfo.name || 'New User'}!
                        </h1>
                        <p className="text-slate-600 mb-4">Your health data is now under your control</p>
                        {walletAddress && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 inline-block">
                                <p className="text-xs text-blue-800 font-mono">
                                    Wallet: {walletAddress.substring(0, 10)}...{walletAddress.substring(walletAddress.length - 8)}
                                </p>
                            </div>
                        )}
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
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
                                <p className="text-slate-600 mb-6">Let's start with the basics</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={personalInfo.name}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                            placeholder="Alex Johnson"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={personalInfo.dateOfBirth}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={personalInfo.phone}
                                            onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
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

                        {currentStep === 2 && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Upload Existing Medical Records</h3>
                                <p className="text-slate-600 mb-6">Add your previous medical records to your secure vault</p>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer"
                                >
                                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                    <p className="text-slate-600 font-medium mb-2">Drag and drop files here</p>
                                    <p className="text-sm text-slate-500 mb-4">or click to browse</p>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            fileInputRef.current?.click()
                                        }}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        Choose Files
                                    </button>
                                </div>

                                {uploadedFiles.length > 0 && (
                                    <div className="mt-6 space-y-2">
                                        <h4 className="text-sm font-semibold text-slate-700 mb-3">Uploaded Files ({uploadedFiles.length})</h4>
                                        {uploadedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-200">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-5 h-5 text-indigo-600" />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{file.name}</p>
                                                        <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveFile(index)}
                                                    className="text-slate-400 hover:text-red-600 transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {currentStep === 3 && (
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

                        {currentStep === 4 && (
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
