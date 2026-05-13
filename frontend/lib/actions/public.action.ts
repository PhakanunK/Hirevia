import { publicFetch, publicFetchFormData } from "@/lib/api"
import type { JobPublicResponse } from "@/lib/models/job.model"
import type {
  ApplicationStatusResponse,
  ApplicationSubmit,
  ApplicationSubmitResponse,
  UploadResponse,
} from "@/lib/models/application.model"
import type { PaginatedResponse } from "@/lib/models/user.model"
import { PAGE_SIZE_CARD } from "@/lib/utils/constants"

export interface GetPublicJobsParams {
  page?: number
  page_size?: number
  keyword?: string
  job_type?: string
  salary_min?: string
  salary_max?: string
}

export const getPublicJobs = ({
  page = 1,
  page_size = PAGE_SIZE_CARD,
  keyword,
  job_type,
  salary_min,
  salary_max,
}: GetPublicJobsParams = {}) => {
  const params: Record<string, string> = {
    page: String(page),
    page_size: String(page_size),
  }
  if (keyword) params.keyword = keyword
  if (job_type) params.job_type = job_type
  if (salary_min) params.salary_min = salary_min
  if (salary_max) params.salary_max = salary_max
  return publicFetch<PaginatedResponse<JobPublicResponse>>("/jobs", { params })
}

export const getPublicJob = (id: string | number) =>
  publicFetch<JobPublicResponse>(`/jobs/${id}`)

export const getApplicationStatus = (token: string) =>
  publicFetch<ApplicationStatusResponse>("/status", { params: { token } })

export const uploadResume = (file: File) => {
  const form = new FormData()
  form.append("file", file)
  return publicFetchFormData<UploadResponse>("/upload/resume", form)
}

export const submitApplication = (data: ApplicationSubmit) =>
  publicFetch<ApplicationSubmitResponse>("/apply", {
    method: "POST",
    body: JSON.stringify(data),
  })
