import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { Upload, Shield, CheckCircle, Stethoscope, Wallet } from 'lucide-react'

export default function DoctorRegistration() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        licenseNumber: '',
        specialty: '',
        hospital: '',
        password: '',
        walletAddress: ''
    })
    const [licenseFile, setLicenseFile] = useState<File | null>(null)
    const [idFile, setIdFile] = useState<File | null>(null)
    const licenseInputRef = useRef<HTMLInputElement>(null)
    const idInputRef = useRef<HTMLInputElement>(null)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'license' | 'id') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'license') {
                setLicenseFile(e.target.files[0])
            } else {
                setIdFile(e.target.files[0])
            }
        }
    }

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum)
                const signer = await provider.getSigner()
                const address = await signer.getAddress()
                setFormData(prev => ({ ...prev, walletAddress: address }))
            } catch (error) {
                console.error("Error connecting wallet:", error)
                alert("Failed to connect wallet. Please try again.")
            }
        } else {
            alert("MetaMask is not installed. Please install it to continue.")
            window.open('https://metamask.io/download/', '_blank')
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!licenseFile || !idFile) {
            alert('Please upload both verification documents.')
            return
        }
        setIsSubmitted(true)
        // Simulate account creation and verification process
        setTimeout(() => {
            // In a real app, we would send this data to the backend
            console.log('Registering doctor:', formData)
            console.log('Files:', { licenseFile, idFile })
            navigate('/doctor-dashboard')
        }, 2000)
    }

    const specialties = [
        'Cardiology',
        'Dermatology',
        'Emergency Medicine',
        'Family Medicine',
        'Internal Medicine',
        'Neurology',
        'Pediatrics',
        'Psychiatry',
        'Surgery'
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-3xl mx-auto py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl mb-4 shadow-2xl">
                        <Stethoscope className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Healthcare Provider Registration</h1>
                    <p className="text-slate-600">Join HealthGuard Pro to access patient records securely</p>
                </div>

                {!isSubmitted ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* License Number */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Medical License Number *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.licenseNumber}
                                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                    placeholder="MD123456"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Create Password *
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Specialty */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Specialty *
                                </label>
                                <select
                                    required
                                    value={formData.specialty}
                                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                >
                                    <option value="">Select specialty</option>
                                    {specialties.map((specialty) => (
                                        <option key={specialty} value={specialty}>
                                            {specialty}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Hospital/Affiliation */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Hospital/Affiliation *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.hospital}
                                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                    placeholder="City General Hospital"
                                />
                            </div>

                            {/* Wallet Address */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Wallet Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.walletAddress}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none"
                                        placeholder="Connect your wallet"
                                    />
                                    {!formData.walletAddress && (
                                        <button
                                            type="button"
                                            onClick={connectWallet}
                                            className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 rounded-lg font-bold text-sm hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 shadow-md"
                                        >
                                            <Wallet className="w-4 h-4" />
                                            Connect MetaMask
                                        </button>
                                    )}
                                </div>
                                {formData.walletAddress && (
                                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Connected via MetaMask
                                    </p>
                                )}
                            </div>

                            {/* Document Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Upload Verification Documents *
                                </label>
                                <div className="space-y-3">
                                    {/* Medical License Upload */}
                                    <div
                                        onClick={() => licenseInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${licenseFile ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-indigo-400'}`}
                                    >
                                        <input
                                            type="file"
                                            ref={licenseInputRef}
                                            onChange={(e) => handleFileChange(e, 'license')}
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        {licenseFile ? (
                                            <>
                                                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                                <p className="text-sm font-bold text-green-700 mb-1">{licenseFile.name}</p>
                                                <p className="text-xs text-green-600">File selected</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                                <p className="text-sm font-medium text-slate-600 mb-1">Upload Medical License</p>
                                                <p className="text-xs text-slate-500">PDF, JPG, or PNG (Max 5MB)</p>
                                            </>
                                        )}
                                    </div>

                                    {/* Government ID Upload */}
                                    <div
                                        onClick={() => idInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${idFile ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-indigo-400'}`}
                                    >
                                        <input
                                            type="file"
                                            ref={idInputRef}
                                            onChange={(e) => handleFileChange(e, 'id')}
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        {idFile ? (
                                            <>
                                                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                                <p className="text-sm font-bold text-green-700 mb-1">{idFile.name}</p>
                                                <p className="text-xs text-green-600">File selected</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                                <p className="text-sm font-medium text-slate-600 mb-1">Upload Government ID</p>
                                                <p className="text-xs text-slate-500">PDF, JPG, or PNG (Max 5MB)</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <p className="text-sm text-blue-800 flex items-start gap-2">
                                    <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>
                                        Your documents will be reviewed by our verification team. This process typically takes 24-48 hours.
                                        For this demo, verification is instant.
                                    </span>
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-blue-500/30"
                            >
                                Submit for Verification
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Verification Complete!</h2>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold mb-4">
                            <CheckCircle className="w-5 h-5" />
                            Verified Cardiologist
                        </div>
                        <p className="text-slate-600 mb-6">Your provider profile is now live</p>
                        <p className="text-sm text-slate-500 mb-8">Patients can now share records with you</p>
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                            <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <span>Redirecting to dashboard...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
