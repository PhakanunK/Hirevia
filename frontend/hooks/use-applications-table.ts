"use client"

import { useState, useEffect, useCallback } from "react"
import { getApplications } from "@/lib/actions/application.action"
import { getJobs } from "@/lib/actions/job.action"
import { PAGE_SIZE_TABLE } from "@/lib/utils/constants"
import type { ApplicationResponse } from "@/lib/models/application.model"
import type { PaginationMeta } from "@/lib/models/user.model"
import type { JobAdminResponse } from "@/lib/models/job.model"

export function useApplicationsTable(initialJobId?: string) {
  const [applications, setApplications] = useState<ApplicationResponse[]>([])
  const [jobs, setJobs] = useState<JobAdminResponse[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedJob, setSelectedJob] = useState(initialJobId || "all")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    getJobs({ page: 1, page_size: 100 })
      .then((res) => setJobs(res.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  const fetchApplications = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getApplications({
        page: currentPage,
        page_size: PAGE_SIZE_TABLE,
        keyword: debouncedSearch || undefined,
        job_id: selectedJob !== "all" ? selectedJob : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
      setApplications(res.data)
      setMeta(res.meta)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, statusFilter, selectedJob, debouncedSearch])

  useEffect(() => { fetchApplications() }, [fetchApplications])

  const setSearchAndReset = (v: string) => { setSearch(v); setCurrentPage(1) }
  const setStatusAndReset = (v: string) => { setStatusFilter(v); setCurrentPage(1) }
  const setJobAndReset = (v: string) => { setSelectedJob(v); setCurrentPage(1) }

  return {
    applications,
    jobs,
    isLoading,
    error,
    search,
    statusFilter,
    selectedJob,
    currentPage,
    totalPages: meta ? meta.total_pages : 1,
    setSearch: setSearchAndReset,
    setStatusFilter: setStatusAndReset,
    setSelectedJob: setJobAndReset,
    setCurrentPage,
    retry: fetchApplications,
  }
}
