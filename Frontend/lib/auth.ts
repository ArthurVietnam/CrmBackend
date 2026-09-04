interface User {
  id: number
  name: string
  email: string
  role: "Company" | "User"
}

interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  login(email: string, password: string, role: "Company" | "User"): AuthResponse | null {
    // Mock authentication - replace with actual API call
    if (email && password) {
      const user: User = {
        id: 1,
        name: email.split("@")[0],
        email,
        role,
      }
      const token = `mock-token-${Date.now()}`

      localStorage.setItem("auth_token", token)
      localStorage.setItem("user", JSON.stringify(user))

      return { token, user }
    }
    return null
  },

  logout() {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  },

  getToken(): string | null {
    return localStorage.getItem("auth_token")
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
