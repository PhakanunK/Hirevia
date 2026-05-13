// ─── Enums ───────────────────────────────────────────────────────────────────

export type JobType = "full_time" | "internship" | "contract"
// removed "part_time" — not in backend enum

export type JobStatus = "open" | "closed" | "draft"

export type ApplicationStatus = "applied" | "screening" | "interview" | "offer" | "rejected"

export type UserRole = "head_admin" | "admin"

export type UserStatus = "active" | "suspended"

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export interface JobPublicResponse {
  id: number                   // int not string
  title: string
  job_type: JobType            // was "type" in v0, backend uses "job_type"
  description: string
  requirements: string         // plain string, NOT string[]
  headcount: number            // missing in v0
  min_salary: number           // was "salary_min" in v0
  max_salary: number | null    // was "salary_max" in v0
  urgent: boolean              // was "is_urgent" in v0
  status: JobStatus
  published_at: string | null
  // NO: department, location — not in backend schema
}

export interface JobAdminResponse {
  id: number
  title: string
  job_type: JobType
  description: string
  requirements: string         // plain string, NOT string[]
  headcount: number
  min_salary: number
  max_salary: number | null
  urgent: boolean
  status: JobStatus
  created_at: string
  updated_at: string
  user_id: number | null
  published_at: string | null
  closed_at: string | null
  is_archived: boolean
  archived_at: string | null
  // NO: department, location — not in backend schema
}

export interface JobCreate {
  title: string
  job_type: JobType
  description: string
  requirements: string
  headcount: number
  min_salary: number
  max_salary?: number | null
  urgent: boolean
}

export interface JobUpdate {
  title?: string | null
  job_type?: JobType | null
  description?: string | null
  requirements?: string | null
  headcount?: number | null
  min_salary?: number | null
  max_salary?: number | null
  urgent?: boolean | null
}

export interface JobStatusUpdate {
  status: JobStatus
}

// ─── Applications ─────────────────────────────────────────────────────────────

export interface ApplicationResponse {
  id: number
  job_id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  resume_url: string
  portfolio_url: string | null
  status: ApplicationStatus
  created_at: string
  updated_at: string
  interview_date: string | null
  rejected_at: string | null
  // NO: job_title, cover_letter — not in backend ApplicationResponse
}

export interface ApplicationStatusResponse {
  id: number
  job_id: number
  first_name: string
  last_name: string
  status: ApplicationStatus
  interview_date: string | null
}

export interface ApplicationSubmit {
  job_id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  resume_url: string
  portfolio_url?: string | null
}

export interface ApplicationSubmitResponse {
  message: string
  tracking_token: string
}

export interface UploadResponse {
  url: string
}

export interface ApplicationStatusUpdate {
  status: ApplicationStatus
  interview_date?: string | null
}

export interface InterviewDateUpdate {
  interview_date: string
}

// ─── Users ────────────────────────────────────────────────────────────────────

export interface UserResponse {
  id: number
  username: string             // was "full_name" in v0
  email: string
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at: string
  // NO: suspended_at — not in backend UserResponse
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

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface UserLogin {
  email: string
  password: string
}

export interface Token {
  access_token: string
  token_type: string
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface PaginatedResponse<T> {
  data: T[]                    // was "items" in v0, backend uses "data"
  meta: PaginationMeta
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

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
  summary: ApplicationSummary  // was "status_summary" in v0
}

// ─── Page size constants ──────────────────────────────────────────────────────

export const PAGE_SIZE_CARD = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE_CARD || "6", 10)
export const PAGE_SIZE_TABLE = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE_TABLE || "10", 10)