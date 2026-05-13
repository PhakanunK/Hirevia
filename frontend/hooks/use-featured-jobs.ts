"use client"

import { useState, useEffect } from "react"
import { getPublicJobs } from "@/lib/actions/public.action"
import type { JobPublicResponse } from "@/lib/models/job.model"

export function useFeaturedJobs() {
  const [jobs, setJobs] = useState<JobPublicResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getPublicJobs({ page: 1, page_size: 3 })
      .then((res) => setJobs(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  return { jobs, isLoading }
}
