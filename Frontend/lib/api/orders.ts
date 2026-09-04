import { apiClient } from "./client"
import type { OrderReadDto, OrderCreateDto, OrderUpdateDto } from "../types/dtos"

export const ordersApi = {
  async getAll(): Promise<OrderReadDto[]> {
    return apiClient.get<OrderReadDto[]>("/api/Order/GetByCompany")
  },

  async getById(id: string): Promise<OrderReadDto> {
    return apiClient.get<OrderReadDto>(`/api/Order/Get/${id}`)
  },

  async create(data: OrderCreateDto): Promise<OrderReadDto> {
    return apiClient.post<OrderReadDto>("/api/Order/Create", data)
  },

  async update(id: string, data: OrderUpdateDto): Promise<OrderReadDto> {
    return apiClient.put<OrderReadDto>(`/api/Order/Update/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/api/Order/Delete/${id}`)
  },

  async complete(id: string): Promise<void> {
    return apiClient.post(`/api/Order/Complete/${id}`)
  },

  async updateStatus(id: string, status: number): Promise<void> {
    return apiClient.put(`/api/Order/UpdateStatus/${id}?status=${status}`)
  },

  async getByCompany(): Promise<OrderReadDto[]> {
    return apiClient.get<OrderReadDto[]>("/api/Order/GetByCompany")
  },

  async getByClient(clientId: string): Promise<OrderReadDto[]> {
    return apiClient.get<OrderReadDto[]>(`/api/Order/GetByClient/${clientId}`)
  },

  async getByStatus(status: number): Promise<OrderReadDto[]> {
    return apiClient.get<OrderReadDto[]>(`/api/Order/GetByStatus?status=${status}`)
  },

  async getByDateRange(startDate: string, endDate: string): Promise<OrderReadDto[]> {
    return apiClient.get<OrderReadDto[]>(`/api/Order/GetByDateRange?startDate=${startDate}&endDate=${endDate}`)
  },
}
