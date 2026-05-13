"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { adminFetch } from "@/lib/api"
import { formatJobType, formatSalary } from "@/lib/format"
import type { JobAdminResponse, JobStatus } from "@/lib/types"
import { Loader2 } from "lucide-react"

const STATUS_COLORS: Record<JobStatus, string> = {
  draft: "bg-gray-100 text-gray-800 border-gray-200",
  open: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-red-100 text-red-800 border-red-200",
}

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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

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

  const handleStatusChange = async (newStatus: JobStatus) => {
    setIsUpdatingStatus(true)
    try {
      const updated = await adminFetch<JobAdminResponse>(`/jobs/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      })
      setJob(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

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
          <div className="mb-1 flex items-center gap-2">
            <span>Status:</span>
            <Badge className={STATUS_COLORS[job.status]}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
          </div>
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

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/applications?job_id=${job.id}`}>
              View Applications
            </Link>
          </Button>
          {!job.is_archived && (
            <>
              <Button asChild variant="outline">
                <Link href={`/admin/jobs/${job.id}/edit`}>Edit</Link>
              </Button>
              {job.status === "draft" && (
                <Button onClick={() => handleStatusChange("open")} disabled={isUpdatingStatus}>
                  {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Publish
                </Button>
              )}
              {job.status === "open" && (
                <Button variant="outline" onClick={() => handleStatusChange("closed")} disabled={isUpdatingStatus}>
                  {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Close
                </Button>
              )}
              {job.status === "closed" && (
                <Button variant="outline" onClick={() => handleStatusChange("open")} disabled={isUpdatingStatus}>
                  {isUpdatingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Reopen
                </Button>
              )}
              <Button variant="destructive" onClick={handleArchive} disabled={isArchiving}>
                {isArchiving ? "Archiving..." : "Archive"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}