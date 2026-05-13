"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { JobsTable } from "@/components/admin/jobs-table"
import { ArrowLeft } from "lucide-react"

export default function ArchivedJobsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Archived Jobs</h1>
      </div>
      <JobsTable isArchived={true} />
    </div>
  )
}
