"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageLoader, PageError } from "@/components/ui/page-states"
import { getJob, updateJob, archiveJob } from "@/lib/actions/job.action"
import type { JobUpdate } from "@/lib/models/job.model"
import { JobFormFields, type JobFormData } from "@/components/admin/job-form-fields"

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [formData, setFormData] = useState<JobFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getJob(id)
      .then((data) => {
        setFormData({
          title: data.title,
          job_type: data.job_type,
          description: data.description,
          requirements: data.requirements,
          headcount: data.headcount,
          min_salary: String(data.min_salary / 1000),
          max_salary: data.max_salary ? String(data.max_salary / 1000) : "",
          urgent: data.urgent,
        })
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load job"))
      .finally(() => setIsLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return
    setIsSubmitting(true)
    setError(null)

    try {
      const payload: JobUpdate = {
        title: formData.title,
        job_type: formData.job_type as JobUpdate["job_type"],
        description: formData.description,
        requirements: formData.requirements,
        headcount: formData.headcount,
        min_salary: parseInt(formData.min_salary) * 1000,
        max_salary: formData.max_salary ? parseInt(formData.max_salary) * 1000 : null,
        urgent: formData.urgent,
      }
      await updateJob(id, payload)
      router.push(`/admin/jobs/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update job")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to archive this job?")) return
    setIsDeleting(true)
    try {
      await archiveJob(id)
      router.push("/admin/jobs")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive job")
      setIsDeleting(false)
    }
  }

  if (isLoading) return <PageLoader />
  if (!formData) return <PageError message={error ?? "Job not found"} action={{ label: "Back to Jobs", onClick: () => router.push("/admin/jobs") }} />

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Update Job</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <JobFormFields data={formData} onChange={setFormData} disabled={isSubmitting} />
            <div className="flex justify-between">
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Archiving..." : "Archive Job"}
              </Button>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
