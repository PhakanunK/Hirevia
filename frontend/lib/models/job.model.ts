export type JobType = "full_time" | "internship" | "contract"

export type JobStatus = "open" | "closed" | "draft"

export interface JobPublicResponse {
  id: number
  title: string
  job_type: JobType
  description: string
  requirements: string
  headcount: number
  min_salary: number
  max_salary: number | null
  urgent: boolean
  status: JobStatus
  published_at: string | null
}

export interface JobAdminResponse {
  id: number
  title: string
  job_type: JobType
  description: string
  requirements: string
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
