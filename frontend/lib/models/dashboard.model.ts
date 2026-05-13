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
