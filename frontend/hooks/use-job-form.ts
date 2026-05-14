"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getJob, createJob, updateJob, archiveJob } from "@/lib/actions/job.action"
import type { JobCreate, JobUpdate } from "@/lib/models/job.model"
import { SALARY_UNIT } from "@/lib/utils/constants"
import { DEFAULT_JOB_FORM_DATA, type JobFormData } from "@/components/admin/job-form-fields"

export function useJobForm(id?: string) {
  const router = useRouter()
  const isEdit = Boolean(id)
  const [formData, setFormData] = useState<JobFormData | null>(isEdit ? null : DEFAULT_JOB_FORM_DATA)
  const [isLoading, setIsLoading] = useState(isEdit)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getJob(id)
      .then((data) => setFormData({
        title: data.title,
        job_type: data.job_type,
        description: data.description,
        requirements: data.requirements,
        headcount: data.headcount,
        min_salary: String(data.min_salary / SALARY_UNIT),
        max_salary: data.max_salary ? String(data.max_salary / SALARY_UNIT) : "",
        urgent: data.urgent,
      }))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load job"))
      .finally(() => setIsLoading(false))
  }, [id])

  const buildPayload = (data: JobFormData): JobCreate | JobUpdate => ({
    title: data.title,
    job_type: data.job_type,
    description: data.description,
    requirements: data.requirements,
    headcount: data.headcount,
    min_salary: parseInt(data.min_salary) * SALARY_UNIT,
    max_salary: data.max_salary ? parseInt(data.max_salary) * SALARY_UNIT : null,
    urgent: data.urgent,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return
    if (
      formData.max_salary &&
      parseInt(formData.max_salary) < parseInt(formData.min_salary)
    ) {
      setError("Maximum salary must be greater than or equal to minimum salary.")
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      if (id) {
        await updateJob(id, buildPayload(formData))
        router.push(`/admin/jobs/${id}`)
      } else {
        await createJob(buildPayload(formData) as JobCreate)
        router.push("/admin/jobs")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : isEdit ? "Failed to update job" : "Failed to create job")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!id || !confirm("Are you sure you want to archive this job?")) return
    setIsDeleting(true)
    try {
      await archiveJob(id)
      router.push("/admin/jobs")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive job")
      setIsDeleting(false)
    }
  }

  return {
    formData,
    setFormData,
    isLoading,
    isSubmitting,
    isDeleting,
    isEdit,
    error,
    handleSubmit,
    handleDelete,
  }
}
