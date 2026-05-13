"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createJob } from "@/lib/actions/job.action"
import type { JobCreate } from "@/lib/models/job.model"
import { JobFormFields, DEFAULT_JOB_FORM_DATA, type JobFormData } from "@/components/admin/job-form-fields"

export default function CreateJobPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<JobFormData>(DEFAULT_JOB_FORM_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const payload: JobCreate = {
        title: formData.title,
        job_type: formData.job_type as JobCreate["job_type"],
        description: formData.description,
        requirements: formData.requirements,
        headcount: formData.headcount,
        min_salary: parseInt(formData.min_salary) * 1000,
        max_salary: formData.max_salary ? parseInt(formData.max_salary) * 1000 : null,
        urgent: formData.urgent,
      }
      await createJob(payload)
      router.push("/admin/jobs")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Create New Job</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <JobFormFields data={formData} onChange={setFormData} disabled={isSubmitting} />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
