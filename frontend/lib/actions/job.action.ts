import { adminFetch } from "@/lib/api"
import type { JobAdminResponse, JobCreate, JobUpdate, JobStatus } from "@/lib/models/job.model"
import type { PaginatedResponse } from "@/lib/models/user.model"
import { PAGE_SIZE_TABLE } from "@/lib/utils/constants"

export interface GetJobsParams {
  page?: number
  page_size?: number
  is_archived?: boolean
  keyword?: string
  job_type?: string
  status?: string
}

export const getJobs = ({ page = 1, page_size = PAGE_SIZE_TABLE, is_archived = false, keyword, job_type, status }: GetJobsParams = {}) => {
  const params: Record<string, string> = {
    page: String(page),
    page_size: String(page_size),
    is_archived: String(is_archived),
  }
  if (keyword) params.keyword = keyword
  if (job_type) params.job_type = job_type
  if (status) params.status = status
  return adminFetch<PaginatedResponse<JobAdminResponse>>("/jobs", { params })
}

export const getJob = (id: string | number) =>
  adminFetch<JobAdminResponse>(`/jobs/${id}`)

export const createJob = (data: JobCreate) =>
  adminFetch<JobAdminResponse>("/jobs", { method: "POST", body: JSON.stringify(data) })

export const updateJob = (id: string | number, data: JobUpdate) =>
  adminFetch<JobAdminResponse>(`/jobs/${id}`, { method: "PATCH", body: JSON.stringify(data) })

export const archiveJob = (id: string | number) =>
  adminFetch(`/jobs/${id}`, { method: "DELETE" })

export const updateJobStatus = (id: string | number, status: JobStatus) =>
  adminFetch<JobAdminResponse>(`/jobs/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) })
