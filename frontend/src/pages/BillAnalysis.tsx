import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, CheckCircle, AlertTriangle, FileText, Download } from 'lucide-react'

interface BillCharge {
    id: number
    description: string
    amount: number
    status: 'approved' | 'flagged'
    reason?: string
    fairPrice?: number
    overcharge?: number
}

export default function BillAnalysis() {
    const [billUploaded, setBillUploaded] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const billData: { total: number; charges: BillCharge[] } = {
        total: 3500,
        charges: [
            { id: 1, description: 'ER Facility Fee', amount: 1200, status: 'approved' },
            { id: 2, description: 'EKG', amount: 300, status: 'approved' },
            { id: 3, description: 'Lab Work', amount: 500, status: 'approved' },
            {
                id: 4,
                description: 'Critical Care Charge',
                amount: 1500,
                status: 'flagged',
                reason: 'You were stable, not critical',
                fairPrice: 300,
                overcharge: 1200
            }
        ]
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setIsAnalyzing(true)
            // Simulate analysis
            await new Promise(resolve => setTimeout(resolve, 2000))
            setIsAnalyzing(false)
            setBillUploaded(true)
        }
    }

    const approvedTotal = billData.charges
        .filter(c => c.status === 'approved')
        .reduce((sum, c) => sum + c.amount, 0)



    const potentialSavings = billData.charges
        .filter(c => c.status === 'flagged')
        .reduce((sum, c) => sum + (c.overcharge || 0), 0)

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/patient-dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium mb-2 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Medical Bill Analysis</h1>
                    <p className="text-slate-600">AI-powered bill review to detect overcharges</p>
                </div>

                {!billUploaded ? (
                    /* Upload Section */
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 border border-white/20">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <Upload className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Upload Your Medical Bill</h2>
                            <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                Upload a PDF or image of your medical bill and our AI will analyze it for potential overcharges
                            </p>

                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    disabled={isAnalyzing}
                                />
                                <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-12 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all">
                                    {isAnalyzing ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-indigo-600 font-semibold">Analyzing your bill...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                                            <p className="text-slate-600 font-medium mb-2">Drag and drop your bill here</p>
                                            <p className="text-sm text-slate-500 mb-4">or click to browse</p>
                                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold inline-block">
                                                Choose File
                                            </div>
                                        </>
                                    )}
                                </div>
                            </label>

                            <div className="mt-8 grid md:grid-cols-3 gap-4 text-left">
                                <div className="p-4 bg-green-50 rounded-xl">
                                    <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                                    <p className="text-sm font-semibold text-slate-900">Detect Overcharges</p>
                                    <p className="text-xs text-slate-600">AI identifies inflated costs</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl">
                                    <FileText className="w-6 h-6 text-blue-600 mb-2" />
                                    <p className="text-sm font-semibold text-slate-900">Fair Price Comparison</p>
                                    <p className="text-xs text-slate-600">See what you should pay</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-xl">
                                    <Download className="w-6 h-6 text-purple-600 mb-2" />
                                    <p className="text-sm font-semibold text-slate-900">Dispute Letters</p>
                                    <p className="text-xs text-slate-600">Auto-generate appeals</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Analysis Results */
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
                                <p className="text-sm font-semibold text-slate-600 mb-2">Total Bill</p>
                                <p className="text-3xl font-extrabold text-slate-900">${billData.total.toLocaleString()}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg p-6">
                                <p className="text-sm font-semibold text-green-100 mb-2">Approved Charges</p>
                                <p className="text-3xl font-extrabold">${approvedTotal.toLocaleString()}</p>
                            </div>
                            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl shadow-lg p-6">
                                <p className="text-sm font-semibold text-red-100 mb-2">Potential Savings</p>
                                <p className="text-3xl font-extrabold">${potentialSavings.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Detailed Analysis */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Bill Analysis: ER Visit</h2>

                            {/* Approved Charges */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6" />
                                    Approved Charges
                                </h3>
                                <div className="space-y-3">
                                    {billData.charges.filter(c => c.status === 'approved').map(charge => (
                                        <div key={charge.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <span className="font-medium text-slate-900">{charge.description}</span>
                                            </div>
                                            <span className="font-bold text-slate-900">${charge.amount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Flagged Charges */}
                            <div>
                                <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-6 h-6" />
                                    Flagged Charges
                                </h3>
                                <div className="space-y-4">
                                    {billData.charges.filter(c => c.status === 'flagged').map(charge => (
                                        <div key={charge.id} className="p-6 bg-red-50 border-2 border-red-200 rounded-xl">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-start gap-3">
                                                    <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-lg">{charge.description}</p>
                                                        <p className="text-sm text-red-700 mt-1">
                                                            <strong>Reason:</strong> {charge.reason}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-red-700 text-lg">${charge.amount.toLocaleString()}</span>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-red-200">
                                                <div className="bg-white rounded-lg p-3">
                                                    <p className="text-xs text-slate-600 mb-1">Estimated Fair Price</p>
                                                    <p className="text-xl font-bold text-green-600">${charge.fairPrice?.toLocaleString()}</p>
                                                </div>
                                                <div className="bg-white rounded-lg p-3">
                                                    <p className="text-xs text-slate-600 mb-1">Potential Overcharge</p>
                                                    <p className="text-xl font-bold text-red-600">${charge.overcharge?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 pt-6 border-t border-slate-200 grid md:grid-cols-3 gap-4">
                                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    View Detailed Analysis
                                </button>
                                <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg flex items-center justify-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Generate Dispute Letter
                                </button>
                                <button className="bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                                    Contact Insurance
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
