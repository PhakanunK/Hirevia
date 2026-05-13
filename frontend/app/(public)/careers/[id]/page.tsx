"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCareer } from "@/hooks/use-career"
import { formatJobType, formatSalary } from "@/lib/utils/format.utils"
import { Loader2 } from "lucide-react"

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { job, isLoading, error, retry } = useCareer(id)

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 text-center">
        <p className="mb-4 text-destructive">{error || "Job not found"}</p>
        <Button onClick={retry}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-primary">{job.title}</h1>
          {job.urgent && <Badge variant="destructive" className="shrink-0">Urgent</Badge>}
        </div>

        <div className="mb-4 space-y-1 text-sm text-muted-foreground">
          <p>Type: {formatJobType(job.job_type)}</p>
          <p>Salary: {formatSalary(job.min_salary, job.max_salary ?? undefined)}</p>
          <p>Open positions: {job.headcount}</p>
          {job.published_at && (
            <p>
              Posted:{" "}
              {new Date(job.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>

        <p className="mb-6 text-sm leading-relaxed">{job.description}</p>

        <div className="mb-8">
          <h2 className="mb-2 font-semibold">Requirements</h2>
          <p className="whitespace-pre-line text-sm text-muted-foreground">{job.requirements}</p>
        </div>

        {job.status === "open" ? (
          <Button asChild>
            <Link href={`/careers/${job.id}/apply`}>Apply to position</Link>
          </Button>
        ) : (
          <Badge variant="secondary">This position is no longer accepting applications</Badge>
        )}
      </div>
    </div>
  )
}
