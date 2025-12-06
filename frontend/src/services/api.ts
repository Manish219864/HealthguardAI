const API_BASE_URL = 'http://localhost:8000'

export interface UserProfile {
    user_id: string
    name: string
    email: string
    wallet_address: string
    date_of_birth: string
    phone: string
    blood_type?: string
    allergies?: string
    medications?: string
    chronic_conditions?: string
}

export interface Activity {
    id: number
    type: string
    text: string
    time: string
}

export interface HealthVaultItem {
    id: number
    name: string
    date: string
    type: string
}

export interface HealthIDRequest {
    name: string
    email: string
    password: string
    date_of_birth: string
}

export interface AuthResponse {
    token: string
    user_id: string
    wallet_address: string
    user_type: string
}

export interface SymptomCheckResponse {
    urgency: string
    possible_causes: string[]
    recommendation: string
    estimated_cost: string
    message: string
}

export const connectWallet = async (walletAddress: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/wallet-connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: walletAddress })
    })
    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Wallet connection failed' }))
        throw new Error(error.detail || 'Wallet connection failed')
    }
    return await response.json()
}

export const createHealthID = async (data: HealthIDRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/create-health-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Account creation failed' }))
        throw new Error(error.detail || 'Account creation failed')
    }
    return await response.json()
}

export const loginWithEmail = async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Login failed' }))
        throw new Error(error.detail || 'Login failed')
    }
    return await response.json()
}

export const analyzeSymptoms = async (symptoms: string): Promise<SymptomCheckResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/ai/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
    })
    if (!response.ok) throw new Error('Symptom analysis failed')
    return await response.json()
}

export const fetchUserProfile = async (userId: string = 'test123'): Promise<UserProfile> => {
    const response = await fetch(`${API_BASE_URL}/api/user/profile?user_id=${userId}`)
    if (!response.ok) {
        throw new Error('Failed to fetch user profile')
    }
    return await response.json()
}

export const fetchUserActivity = async (userId: string = 'test123'): Promise<Activity[]> => {
    const response = await fetch(`${API_BASE_URL}/api/user/activity?user_id=${userId}`)
    if (!response.ok) {
        throw new Error('Failed to fetch user activity')
    }
    const data = await response.json()
    return data.activities
}

export const fetchHealthVault = async (userId: string = 'test123'): Promise<HealthVaultItem[]> => {
    const response = await fetch(`${API_BASE_URL}/api/user/health-vault?user_id=${userId}`)
    if (!response.ok) {
        throw new Error('Failed to fetch health vault')
    }
    const data = await response.json()
    return data.vault
}

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
    const response = await fetch(`${API_BASE_URL}/api/user/profile?user_id=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        throw new Error('Failed to update profile')
    }
    return await response.json()
}

export const uploadRecord = async (file: File, patientId: string) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/api/records/upload?patient_id=${patientId}`, {
        method: 'POST',
        body: formData
    })

    if (!response.ok) {
        throw new Error('Failed to upload record')
    }
    return await response.json()
}
