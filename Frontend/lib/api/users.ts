import { apiClient } from "./client"
import type { UserReadDto, UserCreateDto, UserUpdateDto } from "../types/dtos"

export const usersApi = {
  async getMyProfile(): Promise<UserReadDto> {
    return apiClient.get<UserReadDto>("/api/User/GetMyProfile")
  },

  async getAll(): Promise<UserReadDto[]> {
    return apiClient.get<UserReadDto[]>("/api/User/GetByCompany")
  },

  async getById(id: string): Promise<UserReadDto> {
    return apiClient.get<UserReadDto>(`/api/User/Get/${id}`)
  },

  async create(data: UserCreateDto): Promise<UserReadDto> {
    return apiClient.post<UserReadDto>("/api/User/UserCreate", data)
  },

  async update(id: string, data: UserUpdateDto): Promise<void> {
    return apiClient.put<void>("/api/User/Update", { ...data, Id: id })
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/api/User/Delete?id=${id}`)
  },

  async getByCompany(): Promise<UserReadDto[]> {
    return apiClient.get<UserReadDto[]>("/api/User/GetByCompany")
  },

  async updateRole(id: string, role: number): Promise<void> {
    return apiClient.put(`/api/User/UpdateRole/${id}?role=${role}`)
  },
}
