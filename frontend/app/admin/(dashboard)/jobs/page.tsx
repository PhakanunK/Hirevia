"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JobsTable } from "@/components/admin/jobs-table"
import { Plus } from "lucide-react"

export default function JobsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Jobs</h1>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/jobs/archived">View Archived</Link>
          </Button>
        </div>
        <Button asChild>
          <Link href="/admin/jobs/create">
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Link>
        </Button>
      </div>
      <JobsTable isArchived={false} />
    </div>
  )
}
