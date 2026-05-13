import { adminFetch } from "@/lib/api"
import type { UserResponse, UserCreate, UserUpdate, PaginatedResponse } from "@/lib/models/user.model"
import { PAGE_SIZE_TABLE } from "@/lib/utils/constants"

export interface GetUsersParams {
  page?: number
  page_size?: number
  role?: string
  status?: string
}

export const getUsers = ({ page = 1, page_size = PAGE_SIZE_TABLE, role, status }: GetUsersParams = {}) => {
  const params: Record<string, string> = {
    page: String(page),
    page_size: String(page_size),
  }
  if (role) params.role = role
  if (status) params.status = status
  return adminFetch<PaginatedResponse<UserResponse>>("/users", { params })
}

export const getCurrentUser = () =>
  adminFetch<UserResponse>("/users/me")

export const getUser = (id: string | number) =>
  adminFetch<UserResponse>(`/users/${id}`)

export const createUser = (data: UserCreate) =>
  adminFetch<UserResponse>("/users", { method: "POST", body: JSON.stringify(data) })

export const updateUser = (id: string | number, data: UserUpdate) =>
  adminFetch<UserResponse>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) })

export const suspendUser = (id: string | number) =>
  adminFetch(`/users/${id}`, { method: "DELETE" })
