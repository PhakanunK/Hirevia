export type UserRole = "head_admin" | "admin"

export type UserStatus = "active" | "suspended"

export interface UserResponse {
  id: number
  username: string
  email: string
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at: string
}

export interface UserCreate {
  username: string
  email: string
  password: string
  role: UserRole
}

export interface UserUpdate {
  username?: string | null
  email?: string | null
  password?: string | null
  role?: UserRole | null
}

export interface UserLogin {
  email: string
  password: string
}

export interface Token {
  access_token: string
  token_type: string
}

export interface PaginationMeta {
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface UpcomingInterview {
  applicant_name: string
  job_title: string
  interview_date: string
}

export interface LatestApplication {
  applicant_name: string
  job_title: string
  applied_date: string
}

export interface ApplicationSummary {
  applied: number
  screening: number
  interview: number
  offer: number
  rejected: number
}

export interface DashboardResponse {
  total_jobs: number
  total_urgent_jobs: number
  total_applications: number
  upcoming_interviews: UpcomingInterview[]
  latest_applications: LatestApplication[]
  summary: ApplicationSummary
}
