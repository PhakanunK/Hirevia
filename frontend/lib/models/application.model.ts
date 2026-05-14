export type ApplicationStatus = "applied" | "screening" | "interview" | "offer" | "rejected" | "declined"

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
