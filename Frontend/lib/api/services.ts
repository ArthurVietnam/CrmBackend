import { apiClient } from "./client"
import type { ServiceReadDto, ServiceCreateDto, ServiceUpdateDto } from "../types/dtos"

export const servicesApi = {
  async getAll(): Promise<ServiceReadDto[]> {
    return apiClient.get<ServiceReadDto[]>("/api/Service/GetByCompany")
  },

  async getById(id: number): Promise<ServiceReadDto> {
    return apiClient.get<ServiceReadDto>(`/api/Service/Get/${id}`)
  },

  async create(data: ServiceCreateDto): Promise<ServiceReadDto> {
    return apiClient.post<ServiceReadDto>("/api/Service/Create", data)
  },

  async update(id: number, data: ServiceUpdateDto): Promise<ServiceReadDto> {
    return apiClient.put<ServiceReadDto>("/api/Service/Update", { ...data, Id: id })
  },

  async delete(id: number): Promise<void> {
    return apiClient.delete(`/api/Service/Delete/${id}`)
  },

  async getPopular(): Promise<ServiceReadDto[]> {
    return apiClient.get<ServiceReadDto[]>("/api/Service/Popular")
  },

  async search(query: string): Promise<ServiceReadDto[]> {
    return apiClient.get<ServiceReadDto[]>(`/api/Service/Search?query=${query}`)
  },

  async getByCompany(): Promise<ServiceReadDto[]> {
    return apiClient.get<ServiceReadDto[]>("/api/Service/GetByCompany")
  },

  async getByDateRange(startDate: string, endDate: string): Promise<ServiceReadDto[]> {
    return apiClient.get<ServiceReadDto[]>(`/api/Service/GetByDateRange?startDate=${startDate}&endDate=${endDate}`)
  },
}
