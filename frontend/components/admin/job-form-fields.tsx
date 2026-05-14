"use client"

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
import type { JobType } from "@/lib/models/job.model"

export interface JobFormData {
  title: string
  job_type: JobType
  description: string
  requirements: string
  headcount: number
  min_salary: string
  max_salary: string
  urgent: boolean
}

export const DEFAULT_JOB_FORM_DATA: JobFormData = {
  title: "",
  job_type: "full_time",
  description: "",
  requirements: "",
  headcount: 1,
  min_salary: "",
  max_salary: "",
  urgent: false,
}

interface JobFormFieldsProps {
  data: JobFormData
  onChange: (data: JobFormData) => void
  disabled?: boolean
}

export function JobFormFields({ data, onChange, disabled }: JobFormFieldsProps) {
  const set = (patch: Partial<JobFormData>) => onChange({ ...data, ...patch })

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            placeholder="e.g. UX/UI Designer"
            value={data.title}
            onChange={(e) => set({ title: e.target.value })}
            disabled={disabled}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="job_type">Type</Label>
          <Select value={data.job_type} onValueChange={(v) => set({ job_type: v as JobType })} disabled={disabled}>
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
          value={data.description}
          onChange={(e) => set({ description: e.target.value })}
          rows={4}
          disabled={disabled}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          placeholder="Enter job requirements..."
          value={data.requirements}
          onChange={(e) => set({ requirements: e.target.value })}
          rows={4}
          disabled={disabled}
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
            value={data.headcount}
            onChange={(e) => set({ headcount: parseInt(e.target.value) || 1 })}
            disabled={disabled}
            required
          />
        </div>
        <div className="flex items-center gap-4 pt-8">
          <Switch
            id="urgent"
            checked={data.urgent}
            onCheckedChange={(checked) => set({ urgent: checked })}
            disabled={disabled}
          />
          <Label htmlFor="urgent">Mark as Urgent</Label>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="min_salary">Salary Min (k)</Label>
          <Input
            id="min_salary"
            type="number"
            min={1}
            placeholder="e.g. 25"
            value={data.min_salary}
            onChange={(e) => set({ min_salary: e.target.value })}
            disabled={disabled}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_salary">Salary Max (k, optional)</Label>
          <Input
            id="max_salary"
            type="number"
            min={1}
            placeholder="e.g. 50"
            value={data.max_salary}
            onChange={(e) => set({ max_salary: e.target.value })}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  )
}
