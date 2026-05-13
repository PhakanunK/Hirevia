"use client"

import { use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageLoader, PageError } from "@/components/ui/page-states"
import { useJob } from "@/hooks/use-job"
import { formatJobType, formatSalary } from "@/lib/utils/format.utils"
import { JOB_STATUS_COLORS } from "@/lib/utils/constants"
import { Loader2 } from "lucide-react"

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { job, isLoading, error, isArchiving, isUpdatingStatus, handleStatusChange, handleArchive } = useJob(id)

  if (isLoading) return <PageLoader />
  if (error || !job) return <PageError message={error ?? "Job not found"} action={{ label: "Back to Jobs", onClick: () => router.push("/admin/jobs") }} />

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Job Detail</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-primary">{job.title}</h2>

        <div className="mb-4 space-y-1 text-sm text-muted-foreground">
          <p>Type: {formatJobType(job.job_type)}</p>
          <p>Salary: {formatSalary(job.min_salary, job.max_salary ?? undefined)}</p>
          <p>Open positions: {job.headcount}</p>
        </div>

        <p className="mb-6 text-sm leading-relaxed">{job.description}</p>

        <div className="mb-6">
          <h3 className="mb-2 font-semibold">Requirements:</h3>
          <p className="whitespace-pre-line text-sm text-muted-foreground">{job.requirements}</p>
        </div>

        <div className="mb-6 text-sm text-muted-foreground">
          <div className="mb-1 flex items-center gap-2">
            <span>Status:</span>
            <Badge className={JOB_STATUS_COLORS[job.status]}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
          </div>
          <p>Created: {new Date(job.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          {job.published_at && (
            <p>Published: {new Date(job.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          )}
          {job.urgent && <Badge variant="destructive" className="mt-2">Urgent</Badge>}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/applications?job_id=${job.id}`}>View Applications</Link>
          </Button>
          {!job.is_archived && (
            <>
              <Button asChild variant="outline">
                <Link href={`/admin/jobs/${job.id}/edit`}>Edit</Link>
              </Button>
              {job.status === "draft" && (
                <Button onClick={() => handleStatusChange("open")} disabled={isUpdatingStatus}>
                  {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Publish
                </Button>
              )}
              {job.status === "open" && (
                <Button variant="outline" onClick={() => handleStatusChange("closed")} disabled={isUpdatingStatus}>
                  {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Close
                </Button>
              )}
              {job.status === "closed" && (
                <Button variant="outline" onClick={() => handleStatusChange("open")} disabled={isUpdatingStatus}>
                  {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
