import { apiClient } from "./client"
import type { OrderServiceReadDto, OrderServiceCreateDto, OrderServiceUpdateDto } from "../types/dtos"

export const orderServicesApi = {
  async getByOrder(orderId: string): Promise<OrderServiceReadDto[]> {
    return apiClient.get<OrderServiceReadDto[]>(`/api/OrderService/GetByOrder/${orderId}`)
  },

  async create(data: OrderServiceCreateDto): Promise<OrderServiceReadDto> {
    return apiClient.post<OrderServiceReadDto>("/api/Order/AddService", data)
  },

  async update(id: string, data: OrderServiceUpdateDto): Promise<OrderServiceReadDto> {
    return apiClient.put<OrderServiceReadDto>(`/api/OrderService/Update/${id}`, data)
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/api/OrderService/Delete/${id}`)
  },
}
