import React, { createContext, useContext, useState, type ReactNode } from 'react'

interface User {
    user_id: string
    name: string
    email: string
    wallet_address: string
    date_of_birth: string
    phone: string
}

interface AuthContextType {
    user: User | null
    setUser: (user: User | null) => void
    login: (userData: User) => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)

    const login = (userData: User) => {
        setUser(userData)
    }

    const isAuthenticated = user !== null

    return (
        <AuthContext.Provider value={{ user, setUser, login, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
