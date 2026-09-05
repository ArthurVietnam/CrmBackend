const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface ApiError {
  message: string
  status: number
}

class ApiClient {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private refreshPromise: Promise<string> | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken")
      this.refreshToken = localStorage.getItem("refreshToken")
    }
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) return this.refreshPromise
    if (!this.refreshToken) throw new Error("No refresh token available")

    const refreshToken = this.refreshToken
    const authType = typeof window !== "undefined" ? localStorage.getItem("authType") : "company"
    const refreshEndpoint = authType === "company" ? "/api/Auth/CompanyRefresh" : "/api/Auth/UserRefresh"

    const refreshUrl = `${API_BASE_URL}${refreshEndpoint}?Token=${encodeURIComponent(refreshToken)}`

    this.refreshPromise = fetch(refreshUrl, {
      method: "GET",
    })
      .then(async (response) => {
        if (!response.ok) {
          this.logout()
          throw new Error("Failed to refresh token")
        }

        const data = (await response.json()) as { AccessToken?: string }
        if (!data.AccessToken) {
          this.logout()
          throw new Error("Refresh response did not contain an access token")
        }

        // The backend returns only a new access token. The refresh token remains valid.
        this.setTokens(data.AccessToken, undefined, authType || "company")
        return data.AccessToken
      })
      .finally(() => {
        this.refreshPromise = null
      })

    return this.refreshPromise
  }

  setTokens(accessToken: string, refreshToken?: string, authType?: string) {
    this.accessToken = accessToken
    if (refreshToken) {
      this.refreshToken = refreshToken
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken)
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken)
      }
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
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers instanceof Headers
        ? Object.fromEntries(options.headers.entries())
        : Array.isArray(options.headers)
          ? Object.fromEntries(options.headers)
          : options.headers ?? {}),
    }

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`
    }

    let response = await fetch(url, {
      ...options,
      headers,
    })

    if (response.status === 401 && this.refreshToken) {
      const newToken = await this.refreshAccessToken()
      const retryHeaders: HeadersInit = {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      }

      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
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
