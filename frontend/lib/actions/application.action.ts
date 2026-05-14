import { adminFetch } from "@/lib/api"
import type { ApplicationResponse, ApplicationStatusUpdate, InterviewDateUpdate } from "@/lib/models/application.model"
import type { PaginatedResponse } from "@/lib/models/user.model"
import { PAGE_SIZE_TABLE } from "@/lib/utils/constants"

export interface GetApplicationsParams {
  page?: number
  page_size?: number
  keyword?: string
  job_id?: string
  status?: string
}

export const getApplications = ({ page = 1, page_size = PAGE_SIZE_TABLE, keyword, job_id, status }: GetApplicationsParams = {}) => {
  const params: Record<string, string> = {
    page: String(page),
    page_size: String(page_size),
  }
  if (keyword) params.keyword = keyword
  if (job_id) params.job_id = job_id
  if (status) params.status = status
  return adminFetch<PaginatedResponse<ApplicationResponse>>("/applications", { params })
}

export const getApplication = (id: string | number) =>
  adminFetch<ApplicationResponse>(`/applications/${id}`)

export const updateApplicationStatus = (id: string | number, data: ApplicationStatusUpdate) =>
  adminFetch(`/applications/${id}/status`, { method: "PATCH", body: JSON.stringify(data) })

export const updateInterviewDate = (id: string | number, data: InterviewDateUpdate) =>
  adminFetch(`/applications/${id}/interview-date`, { method: "PATCH", body: JSON.stringify(data) })
