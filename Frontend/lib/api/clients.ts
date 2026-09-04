import { apiClient } from "./client"
import type { ClientReadDto, ClientCreateDto, ClientUpdateDto } from "../types/dtos"

export const clientsApi = {
  async getByCompany(): Promise<ClientReadDto[]> {
    return apiClient.get<ClientReadDto[]>("/api/Client/GetByCompany")
  },

  async getAll(): Promise<ClientReadDto[]> {
    return apiClient.get<ClientReadDto[]>("/api/Client/GetByCompany")
  },

  async getById(id: number): Promise<ClientReadDto> {
    return apiClient.get<ClientReadDto>(`/api/Client/Get/${id}`)
  },

  async create(data: ClientCreateDto): Promise<ClientReadDto> {
    return apiClient.post<ClientReadDto>("/api/Client/Create", data)
  },

  async update(id: number, data: ClientUpdateDto): Promise<ClientReadDto> {
    return apiClient.put<ClientReadDto>(`/api/Client/Update/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    return apiClient.delete(`/api/Client/Delete/${id}`)
  },

  async search(query: string): Promise<ClientReadDto[]> {
    return apiClient.get<ClientReadDto[]>(`/api/Client/Search?query=${query}`)
  },

  // Removed duplicate getByCompany method
}
