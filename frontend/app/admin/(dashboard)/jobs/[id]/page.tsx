"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { adminFetch } from "@/lib/api"
import { formatJobType, formatSalary } from "@/lib/format"
import type { JobAdminResponse } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [job, setJob] = useState<JobAdminResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isArchiving, setIsArchiving] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await adminFetch<JobAdminResponse>(`/jobs/${id}`)
        setJob(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const handleArchive = async () => {
    try {
      setIsArchiving(true)
      await adminFetch(`/jobs/${id}`, { method: "DELETE" })
      router.push("/admin/jobs")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive job")
      setIsArchiving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-destructive">{error || "Job not found"}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/admin/jobs")}
          >
            Back to Jobs
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Job Detail</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-primary">{job.title}</h2>

        <div className="mb-4 space-y-1 text-sm text-muted-foreground">
          <p>Type: {formatJobType(job.job_type)}</p>
          <p>Salary: {formatSalary(job.min_salary, job.max_salary)}</p>
          <p>Open positions: {job.headcount}</p>
        </div>

        <p className="mb-6 text-sm leading-relaxed">{job.description}</p>

        <div className="mb-6">
          <h3 className="mb-2 font-semibold">Requirements:</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {job.requirements}
          </p>
        </div>

        <div className="mb-6 text-sm text-muted-foreground">
          <p>Status: {job.status === "open" ? "Open" : job.status === "closed" ? "Closed" : "Draft"}</p>
          <p>
            Created:{" "}
            {new Date(job.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {job.published_at && (
            <p>
              Published:{" "}
              {new Date(job.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          {job.urgent && <Badge variant="destructive" className="mt-2">Urgent</Badge>}
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/applications?job_id=${job.id}`}>
              View Applications
            </Link>
          </Button>
          {!job.is_archived && job.status !== "closed" && (
            <>
              <Button asChild>
                <Link href={`/admin/jobs/${job.id}/edit`}>Edit</Link>
              </Button>
              <Button
                variant="destructive"
                onClick={handleArchive}
                disabled={isArchiving}
              >
                {isArchiving ? "Archiving..." : "Archive"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}