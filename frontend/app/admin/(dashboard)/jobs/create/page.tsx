"use client"

import { useState } from "react"
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
import type { JobAdminResponse, JobCreate } from "@/lib/types"

export default function CreateJobPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    job_type: "full_time",      // was "type"
    description: "",
    requirements: "",
    headcount: 1,
    min_salary: "",             // was "salary_min"
    max_salary: "",             // was "salary_max"
    urgent: false,
    // NO status — backend always forces draft on create
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const payload: JobCreate = {
        title: formData.title,
        job_type: formData.job_type as JobCreate["job_type"],
        description: formData.description,
        requirements: formData.requirements, // plain string, NOT split into array
        headcount: formData.headcount,
        min_salary: parseInt(formData.min_salary),
        max_salary: formData.max_salary ? parseInt(formData.max_salary) : null,
        urgent: formData.urgent,
      }

      await adminFetch<JobAdminResponse>("/jobs", {
        method: "POST",
        body: JSON.stringify(payload),
      })

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
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. UX/UI Designer"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_type">Type</Label>
                <Select
                  value={formData.job_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, job_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
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
                placeholder="Job description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="Enter job requirements..."
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
                <Label htmlFor="min_salary">Salary Min</Label>
                <Input
                  id="min_salary"
                  type="number"
                  placeholder="e.g. 50000"
                  value={formData.min_salary}
                  onChange={(e) =>
                    setFormData({ ...formData, min_salary: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_salary">Salary Max (optional)</Label>
                <Input
                  id="max_salary"
                  type="number"
                  placeholder="e.g. 80000"
                  value={formData.max_salary}
                  onChange={(e) =>
                    setFormData({ ...formData, max_salary: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
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