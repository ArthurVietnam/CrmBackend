const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface ApiError {
  message: string
  status: number
}

class ApiClient {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private isRefreshing = false
  private refreshSubscribers: ((token: string) => void)[] = []

  constructor() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken")
      this.refreshToken = localStorage.getItem("refreshToken")
    }
  }

  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback)
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token))
    this.refreshSubscribers = []
  }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available")
    }

    const authType = localStorage.getItem("authType") || "company"
    const refreshEndpoint = authType === "company" ? "/api/Auth/CompanyRefresh" : "/api/Auth/UserRefresh"

    const response = await fetch(`${API_BASE_URL}${refreshEndpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.refreshToken}`,
      },
    })

    if (!response.ok) {
      this.logout()
      throw new Error("Failed to refresh token")
    }

    const data = await response.json()
    this.setTokens(data.AccessToken, data.RefreshToken)
    return data.AccessToken
  }

  setTokens(accessToken: string, refreshToken: string, authType?: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      if (authType) {
        localStorage.setItem("authType", authType)
      }
    }
  }

  logout() {
    this.accessToken = null
    this.refreshToken = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("authType")
      localStorage.removeItem("userType")
      window.location.href = "/"
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`
    }

    let response = await fetch(url, {
      ...options,
      headers,
    })

    if (response.status === 401 && this.refreshToken) {
      if (!this.isRefreshing) {
        this.isRefreshing = true
        try {
          const newToken = await this.refreshAccessToken()
          this.isRefreshing = false
          this.onTokenRefreshed(newToken)
        } catch (error) {
          this.isRefreshing = false
          throw error
        }
      } else {
        await new Promise<string>((resolve) => {
          this.subscribeTokenRefresh((token) => {
            resolve(token)
          })
        })
      }

      // Retry request with new token
      headers["Authorization"] = `Bearer ${this.accessToken}`
      response = await fetch(url, {
        ...options,
        headers,
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      const error: ApiError = {
        message: errorText,
        status: response.status,
      }
      throw error
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return response.json()
    }
    return {} as T
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    console.log("[v0] PUT request to:", endpoint)
    console.log("[v0] PUT data:", data)
    console.log("[v0] PUT data stringified:", JSON.stringify(data))
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  isAuthenticated(): boolean {
    return !!this.accessToken
  }

  getAccessToken(): string | null {
    return this.accessToken
  }
}

export const apiClient = new ApiClient()
