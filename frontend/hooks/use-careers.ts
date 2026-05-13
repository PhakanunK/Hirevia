"use client"

import { useState, useEffect, useCallback } from "react"
import { getPublicJobs } from "@/lib/actions/public.action"
import { PAGE_SIZE_CARD } from "@/lib/utils/constants"
import type { JobPublicResponse } from "@/lib/models/job.model"
import type { PaginationMeta } from "@/lib/models/user.model"

export const SALARY_RANGES = [
  { value: "all", label: "Any Salary" },
  { value: "0:15000", label: "฿0 – ฿15K" },
  { value: "15000:30000", label: "฿15K – ฿30K" },
  { value: "30000:50000", label: "฿30K – ฿50K" },
  { value: "50000:80000", label: "฿50K – ฿80K" },
  { value: "80000:", label: "฿80K+" },
]

export function useCareers() {
  const [jobs, setJobs] = useState<JobPublicResponse[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [salaryRange, setSalaryRange] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [salary_min, salary_max] = salaryRange !== "all"
        ? salaryRange.split(":")
        : [undefined, undefined]
      const res = await getPublicJobs({
        page: currentPage,
        page_size: PAGE_SIZE_CARD,
        keyword: debouncedSearch || undefined,
        job_type: typeFilter !== "all" ? typeFilter : undefined,
        salary_min: salary_min || undefined,
        salary_max: salary_max || undefined,
      })
      setJobs(res.data)
      setMeta(res.meta)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, typeFilter, debouncedSearch, salaryRange])

  useEffect(() => { fetchJobs() }, [fetchJobs])

  const setSearchAndReset = (v: string) => { setSearch(v); setCurrentPage(1) }
  const setSalaryAndReset = (v: string) => { setSalaryRange(v); setCurrentPage(1) }
  const setTypeAndReset = (v: string) => { setTypeFilter(v); setCurrentPage(1) }

  return {
    jobs,
    isLoading,
    error,
    search,
    salaryRange,
    typeFilter,
    currentPage,
    totalPages: meta?.total_pages ?? 1,
    setSearch: setSearchAndReset,
    setSalaryRange: setSalaryAndReset,
    setTypeFilter: setTypeAndReset,
    setCurrentPage,
    retry: fetchJobs,
  }
}
