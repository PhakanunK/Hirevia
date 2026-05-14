"use client"

import { useState, useEffect, useCallback } from "react"
import { getJobs, archiveJob } from "@/lib/actions/job.action"
import { PAGE_SIZE_TABLE } from "@/lib/utils/constants"
import type { JobAdminResponse } from "@/lib/models/job.model"

export function useJobsTable(isArchived: boolean) {
  const [jobs, setJobs] = useState<JobAdminResponse[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getJobs({
        page: currentPage,
        page_size: PAGE_SIZE_TABLE,
        is_archived: isArchived,
        keyword: search || undefined,
        job_type: typeFilter !== "all" ? typeFilter : undefined,
        status: !isArchived && statusFilter !== "all" ? statusFilter : undefined,
      })
      setJobs(data.data)
      setTotalPages(data.meta.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, search, typeFilter, statusFilter, isArchived])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const handleArchive = async (jobId: number) => {
    try {
      await archiveJob(jobId)
      if (jobs.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1)
      } else {
        fetchJobs()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive job")
    }
  }

  const setSearchAndReset = (v: string) => { setSearch(v); setCurrentPage(1) }
  const setTypeAndReset = (v: string) => { setTypeFilter(v); setCurrentPage(1) }
  const setStatusAndReset = (v: string) => { setStatusFilter(v); setCurrentPage(1) }

  return {
    jobs,
    isLoading,
    error,
    search,
    typeFilter,
    statusFilter,
    currentPage,
    totalPages,
    setSearch: setSearchAndReset,
    setTypeFilter: setTypeAndReset,
    setStatusFilter: setStatusAndReset,
    setCurrentPage,
    handleArchive,
    retry: fetchJobs,
  }
}
