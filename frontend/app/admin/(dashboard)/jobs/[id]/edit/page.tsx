"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageLoader, PageError } from "@/components/ui/page-states"
import { useJobForm } from "@/hooks/use-job-form"
import { JobFormFields } from "@/components/admin/job-form-fields"

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { formData, setFormData, isLoading, isSubmitting, isDeleting, error, handleSubmit, handleDelete } = useJobForm(id)

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
