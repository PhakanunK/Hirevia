"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getJob, updateJobStatus, archiveJob } from "@/lib/actions/job.action"
import type { JobAdminResponse, JobStatus } from "@/lib/models/job.model"

export function useJob(id: string) {
  const router = useRouter()
  const [job, setJob] = useState<JobAdminResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isArchiving, setIsArchiving] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  useEffect(() => {
    getJob(id)
      .then(setJob)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load job"))
      .finally(() => setIsLoading(false))
  }, [id])

  const handleStatusChange = async (newStatus: JobStatus) => {
    setIsUpdatingStatus(true)
    try {
      const updated = await updateJobStatus(id, newStatus)
      setJob(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleArchive = async () => {
    setIsArchiving(true)
    try {
      await archiveJob(id)
      router.push("/admin/jobs")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive job")
      setIsArchiving(false)
    }
  }

  return { job, isLoading, error, isArchiving, isUpdatingStatus, handleStatusChange, handleArchive }
}
