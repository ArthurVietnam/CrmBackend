import { apiClient } from "./client"
import type { AppointmentReadDto, AppointmentCreateDto, AppointmentUpdateDto } from "../types/dtos"

export const appointmentsApi = {
  async getByCompany(): Promise<AppointmentReadDto[]> {
    return apiClient.get<AppointmentReadDto[]>("/api/Appointment/GetByCompany")
  },

  async getAll(): Promise<AppointmentReadDto[]> {
    return apiClient.get<AppointmentReadDto[]>("/api/Appointment/GetByCompany")
  },

  async getById(id: number): Promise<AppointmentReadDto> {
    return apiClient.get<AppointmentReadDto>(`/api/Appointment/Get/${id}`)
  },

  async create(data: AppointmentCreateDto): Promise<AppointmentReadDto> {
    return apiClient.post<AppointmentReadDto>("/api/Appointment/Create", data)
  },

  async update(id: number, data: AppointmentUpdateDto): Promise<AppointmentReadDto> {
    return apiClient.put<AppointmentReadDto>(`/api/Appointment/Update/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    return apiClient.delete(`/api/Appointment/Delete/${id}`)
  },

  async complete(id: number): Promise<void> {
    return apiClient.put(`/api/Appointment/Complete/${id}`)
  },

  async getByDate(date: string): Promise<AppointmentReadDto[]> {
    return apiClient.get<AppointmentReadDto[]>(`/api/Appointment/ByDate?date=${date}`)
  },

  async getByStatus(status: string): Promise<AppointmentReadDto[]> {
    return apiClient.get<AppointmentReadDto[]>(`/api/Appointment/ByStatus?status=${status}`)
  },

  async getByClient(clientId: number): Promise<AppointmentReadDto[]> {
    return apiClient.get<AppointmentReadDto[]>(`/api/Appointment/ByClient/${clientId}`)
  },

  async getByService(serviceId: number): Promise<AppointmentReadDto[]> {
    return apiClient.get<AppointmentReadDto[]>(`/api/Appointment/ByService/${serviceId}`)
  },

  async updateStatus(id: string, status: number): Promise<void> {
    return apiClient.put(`/api/Appointment/UpdateStatus/${id}?status=${status}`)
  },
}
