"use client"

import { use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCareer } from "@/hooks/use-career"
import { useApply } from "@/hooks/use-apply"
import { Upload, Loader2 } from "lucide-react"

export default function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { job, isLoading: isLoadingJob, error: jobError, retry: retryJob } = useCareer(id)
  const { formData, setFormData, isSubmitting, submitStep, error: submitError, handleSubmit } = useApply(id)

  if (isLoadingJob) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-24">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (jobError || !job) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="mb-4 text-destructive">{jobError || "Job not found"}</p>
        <Button onClick={retryJob}>Try Again</Button>
      </div>
    )
  }

  if (job.status !== "open") {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-muted-foreground">This position is no longer accepting applications.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-24">
      <h1 className="mb-2 text-center text-2xl font-bold">Submit your application</h1>
      <p className="mb-8 text-center font-medium text-primary">{job.title}</p>

      {submitError && (
        <div className="mb-6 rounded-md bg-destructive/10 p-4 text-center text-destructive">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume</Label>
            <div className="relative">
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFormData({ ...formData, resume: e.target.files?.[0] || null })}
                className="cursor-pointer"
                required
                disabled={isSubmitting}
              />
              <Upload className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio (optional)</Label>
            <Input
              id="portfolio"
              type="url"
              placeholder="https://..."
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {submitStep === "uploading" ? "Uploading resume..." : "Submitting..."}
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
