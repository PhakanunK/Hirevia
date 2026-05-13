"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { adminFetch } from "@/lib/api"
import { APPLICATION_STATUS_CONFIG } from "@/lib/constants"
import type {
  ApplicationResponse,
  JobAdminResponse,
  PaginatedResponse,
  PaginationMeta,
} from "@/lib/types"
import { PAGE_SIZE_TABLE } from "@/lib/types"
import { Search, Eye, MoreHorizontal, Loader2, AlertCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


function ApplicationsContent() {
  const searchParams = useSearchParams()
  const jobIdFilter = searchParams.get("job_id")

  const [applications, setApplications] = useState<ApplicationResponse[]>([])
  const [jobs, setJobs] = useState<JobAdminResponse[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters — drive the API query
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedJob, setSelectedJob] = useState<string>(jobIdFilter || "all")
  const [currentPage, setCurrentPage] = useState(1)

  // Debounced search to avoid hammering the API on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("")
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch jobs once for the filter dropdown (all jobs, no pagination needed here)
  useEffect(() => {
    adminFetch<PaginatedResponse<JobAdminResponse>>("/jobs", {
      params: { page: "1", page_size: "100" },
    })
      .then((res) => setJobs(res.data))
      .catch(() => {
        // Non-critical — filter dropdown just won't populate
      })
  }, [])

  // Fetch applications whenever filters or page change
  const fetchApplications = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params: Record<string, string> = {
        page: String(currentPage),
        page_size: String(PAGE_SIZE_TABLE),
      }
      if (statusFilter !== "all") params.status = statusFilter
      if (selectedJob !== "all") params.job_id = selectedJob
      if (debouncedSearch) params.keyword = debouncedSearch

      const res = await adminFetch<PaginatedResponse<ApplicationResponse>>(
        "/applications",
        { params }
      )
      setApplications(res.data)
      setMeta(res.meta)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, statusFilter, selectedJob, debouncedSearch])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  // Reset to page 1 when filters change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }
  const handleJobChange = (value: string) => {
    setSelectedJob(value)
    setCurrentPage(1)
  }
  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const totalPages = meta ? meta.total_pages : 1

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Applications</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Select value={selectedJob} onValueChange={handleJobChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={String(job.id)}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              {/* job_title is not in ApplicationResponse — show job_id instead.
                  If you want job titles, you'll need a separate lookup or a
                  backend endpoint change to include it in the response. */}
              <TableHead>Job ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                    <p className="text-muted-foreground">{error}</p>
                    <Button size="sm" onClick={fetchApplications}>
                      Retry
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    {app.first_name} {app.last_name}
                  </TableCell>
                  <TableCell>{app.email}</TableCell>
                  <TableCell>
                    {/* Resolve title from local jobs list if available */}
                    {jobs.find((j) => j.id === app.job_id)?.title ?? `#${app.job_id}`}
                  </TableCell>
                  <TableCell>
                    <Badge className={APPLICATION_STATUS_CONFIG[app.status].color}>
                      {APPLICATION_STATUS_CONFIG[app.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(app.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/applications/${app.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination — driven by backend meta */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              disabled={isLoading}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default function ApplicationsPage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}
    >
      <ApplicationsContent />
    </Suspense>
  )
}