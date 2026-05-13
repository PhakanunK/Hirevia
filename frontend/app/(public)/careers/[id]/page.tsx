"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { publicFetch } from "@/lib/api"
import { formatJobType, formatSalary } from "@/lib/format"
import type { Job } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await publicFetch<Job>(`/jobs/${id}`)
      setJob(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">Careers</h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">Careers</h1>
        <div className="py-12 text-center">
          <p className="mb-4 text-destructive">{error || 'Job not found'}</p>
          <Button onClick={fetchJob}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Careers</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-primary">{job.title}</h2>

        <div className="mb-4 space-y-1 text-sm text-muted-foreground">
          <p>Type: {formatJobType(job.type)}</p>
          <p>Salary: {formatSalary(job.salary_min, job.salary_max)}</p>
          <p>Open positions: {job.headcount}</p>
        </div>

        <p className="mb-6 text-sm leading-relaxed">{job.description}</p>

        <div className="mb-6">
          <h3 className="mb-2 font-semibold">Requirements:</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6 text-sm text-muted-foreground">
          <p>Status: {job.status === "open" ? "Open" : "Closed"}</p>
          <p>
            Posted on:{" "}
            {new Date(job.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="mb-4">
          <span className="text-sm text-muted-foreground">Created by: </span>
          <span className="text-sm">{job.created_by}</span>
        </div>

        {job.status === "open" && (
          <Button asChild>
            <Link href={`/careers/${job.id}/apply`}>Apply to position</Link>
          </Button>
        )}

        {job.status !== "open" && (
          <Badge variant="secondary">This position is no longer accepting applications</Badge>
        )}
      </div>
    </div>
  )
}
