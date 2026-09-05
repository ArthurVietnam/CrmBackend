// Auth DTOs
export interface AuthRequest {
  Email: string
  Password: string
}

export interface RefreshRequest {
  RefreshToken: string
}

export interface AuthResponse {
  AccessToken: string
  RefreshToken: string
}

// User DTOs
export interface UserReadDto {
  Id: string
  Name: string
  Email: string
  Phone?: string
  Role: UserRole
}

export interface UserCreateDto {
  Name: string
  Email: string
  Password: string
  Phone?: string
  Role?: UserRole
}

export interface UserUpdateDto {
  Id: string
  Name?: string
  Email?: string
  Phone?: string
  Role?: UserRole
}

// Company DTOs
export interface CompanyReadDto {
  Name: string
  Location: string
  Password: string
  Email: string
  Subscribe: Subscribes
  SubscriptionEnd: string
}

export interface CompanyCreateDto {
  Name: string
  Location: string
  Email: string
  Password: string
}

export interface CompanyUpdateDto {
  Name?: string
  Location?: string
  Email?: string
}

// Client DTOs
export interface ClientReadDto {
  Id: string
  Name: string
  Phone?: string
  Email?: string
  Comment?: string
}

export interface ClientCreateDto {
  Name: string
  Phone?: string
  Email?: string
  Comment?: string
}

export interface ClientUpdateDto {
  Name?: string
  Phone?: string
  Email?: string
  Comment?: string
}

// Service DTOs
export interface ServiceReadDto {
  Id: string
  ServiceName: string
  Price: number
}

export interface ServiceCreateDto {
  ServiceName: string
  Price: number
}

export interface ServiceUpdateDto {
  Id: string
  ServiceName?: string
  Price?: number
}

// Order DTOs
export interface OrderReadDto {
  Id: string
  Date: string
  Description?: string
  Sum: number
  Status: StatusOfWork
  ClientId: string
}

export interface OrderCreateDto {
  Description?: string
  ClientId?: string
}

export interface OrderUpdateDto {
  Description?: string
  ClientId?: string
}

// OrderService DTOs for managing services in orders
export interface OrderServiceReadDto {
  Id: string
  ServiceId?: string // Backend may not return this
  Count: number
  Price: number
  TotalPrice: number
}

export interface OrderServiceCreateDto {
  OrderId: string
  ServiceId: string
  Count: number
}

export interface OrderServiceUpdateDto {
  Id: string
  Count: number
}

// Appointment DTOs
export interface AppointmentReadDto {
  Id: string
  ClientId: string
  ServiceId: string
  DateTime: string
  Comment?: string
  Status: StatusOfWork
}

export interface AppointmentCreateDto {
  ClientId: string
  ServiceId: string
  DateTime: string
  Comment?: string
  Status: StatusOfWork
}

export interface AppointmentUpdateDto {
  DateTime?: string
  Comment?: string
}

// Statistics DTOs
export interface StatisticsReadDto {
  TotalClients: number
  TotalOrders: number
  TotalRevenue: number
  TotalAppointments: number
}

// Enums
export enum StatusOfWork {
  Sheduled = 0,
  InProgress = 1,
  Done = 2,
  Canceled = 3,
}

export enum UserRole {
  Employee = 0,
  Admin = 1,
}

export enum Subscribes {
  Free = 0,
  Basic = 1,
  Pro = 2,
}
