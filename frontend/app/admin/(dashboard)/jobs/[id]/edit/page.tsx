"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { adminFetch } from "@/lib/api"
import type { Job, JobStatus } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    type: "full_time",
    description: "",
    requirements: "",
    headcount: 1,
    salary_min: "",
    salary_max: "",
    urgent: false,
    status: "draft" as JobStatus,
  })

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await adminFetch<Job>(`/jobs/${id}`)
        setJob(data)
        setFormData({
          title: data.title,
          type: data.type,
          description: data.description,
          requirements: data.requirements.join("\n"),
          headcount: data.headcount,
          salary_min: data.salary_min.toString(),
          salary_max: data.salary_max?.toString() || "",
          urgent: data.urgent,
          status: data.status,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJob()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        requirements: formData.requirements.split("\n").filter((r) => r.trim()),
        headcount: formData.headcount,
        salary_min: parseInt(formData.salary_min),
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : undefined,
        urgent: formData.urgent,
      }

      await adminFetch<Job>(`/jobs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      })

      router.push(`/admin/jobs/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update job")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (newStatus: JobStatus) => {
    try {
      setFormData({ ...formData, status: newStatus })
      await adminFetch(`/jobs/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
      // Revert status on error
      if (job) {
        setFormData({ ...formData, status: job.status })
      }
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to archive this job?")) return

    try {
      setIsDeleting(true)
      await adminFetch(`/jobs/${id}`, { method: "DELETE" })
      router.push("/admin/jobs")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive job")
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error && !job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-destructive">{error}</p>
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
      <h1 className="mb-8 text-2xl font-bold">Update Job</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                rows={4}
                required
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="headcount">Headcount</Label>
                <Input
                  id="headcount"
                  type="number"
                  min={1}
                  value={formData.headcount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      headcount: parseInt(e.target.value) || 1,
                    })
                  }
                  required
                />
              </div>
              <div className="flex items-center gap-4 pt-8">
                <Switch
                  id="urgent"
                  checked={formData.urgent}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, urgent: checked })
                  }
                />
                <Label htmlFor="urgent">Mark as Urgent</Label>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salary_min">Salary Min</Label>
                <Input
                  id="salary_min"
                  type="number"
                  value={formData.salary_min}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_min: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_max">Salary Max</Label>
                <Input
                  id="salary_max"
                  type="number"
                  value={formData.salary_max}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_max: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleStatusChange(value as JobStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Archiving..." : "Archive Job"}
              </Button>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
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
