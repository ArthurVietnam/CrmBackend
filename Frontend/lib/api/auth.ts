import { apiClient } from "./client"
import type { AuthRequest, AuthResponse, CompanyCreateDto } from "../types/dtos"

export const authApi = {
  async loginCompany(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/api/Auth/LoginByCompany", {
      Email: email,
      Password: password,
    } as AuthRequest)

    apiClient.setTokens(response.AccessToken, response.RefreshToken, "company")
    return response
  },

  async loginUser(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/api/Auth/LoginByUser", {
      Email: email,
      Password: password,
    } as AuthRequest)

    apiClient.setTokens(response.AccessToken, response.RefreshToken, "user")
    return response
  },

  // Backend: POST /api/Company/CompanyCreate -> returns 201 with no body (no tokens).
  // The company must log in separately after registering.
  async registerCompany(data: CompanyCreateDto): Promise<void> {
    await apiClient.post<void>("/api/Auth/CompanyCreate", data)
  },

  logout() {
    apiClient.logout()
  },

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated()
  },
}
