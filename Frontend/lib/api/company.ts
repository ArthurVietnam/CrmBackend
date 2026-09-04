import { apiClient } from "./client"
import type { CompanyReadDto, CompanyUpdateDto, StatisticsReadDto } from "../types/dtos"

export const companyApi = {
  async getMyCompany(): Promise<CompanyReadDto> {
    return apiClient.get<CompanyReadDto>("/api/Company/GetMyCompany")
  },

  async getStatistics(): Promise<StatisticsReadDto> {
    return apiClient.get<StatisticsReadDto>("/api/Company/GetStatistics")
  },

  async getProfile(id: number): Promise<CompanyReadDto> {
    return apiClient.get<CompanyReadDto>(`/api/Company/Get/${id}`)
  },

  async updateProfile(data: CompanyUpdateDto): Promise<void> {
    return apiClient.put<void>("/api/Company/Update", data)
  },

  async getByEmail(email: string): Promise<CompanyReadDto> {
    return apiClient.get<CompanyReadDto>(`/api/Company/GetByEmail/${email}`)
  },

  async resendCode(email: string): Promise<void> {
    return apiClient.post("/api/Company/ResendCode", { Email: email })
  },

  async confirmCode(email: string, code: string): Promise<void> {
    return apiClient.post("/api/Company/ConfirmCode", { Email: email, Code: code })
  },

  async extendSubscription(companyId: number, days: number): Promise<void> {
    return apiClient.put("/api/Company/ExtendSubscription", { CompanyId: companyId, Days: days })
  },

  async deactivate(companyId: number): Promise<void> {
    return apiClient.delete(`/api/Company/Deactivate/${companyId}`)
  },
}
