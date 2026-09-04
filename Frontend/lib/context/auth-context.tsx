"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi } from "../api/auth"

type UserType = "company" | "user" | null

interface AuthContextType {
  userType: UserType
  isAuthenticated: boolean
  login: (email: string, password: string, type: "company" | "user") => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType") as UserType
    if (authApi.isAuthenticated() && storedUserType) {
      setUserType(storedUserType)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, type: "company" | "user") => {
    if (type === "company") {
      await authApi.loginCompany(email, password)
    } else {
      await authApi.loginUser(email, password)
    }

    setUserType(type)
    localStorage.setItem("userType", type)
  }

  const logout = () => {
    authApi.logout()
    setUserType(null)
    localStorage.removeItem("userType")
  }

  return (
    <AuthContext.Provider
      value={{
        userType,
        isAuthenticated: !!userType,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
