"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageLoader, PageError } from "@/components/ui/page-states"
import { adminFetch } from "@/lib/api"
import { formatJobType, formatSalaryCompact } from "@/lib/format"
import type { JobAdminResponse, PaginatedResponse } from "@/lib/types"
import { PAGE_SIZE_TABLE } from "@/lib/types"
import { Search, Eye, Pencil, MoreHorizontal, Archive } from "lucide-react"

interface JobsTableProps {
  isArchived: boolean
}

export function JobsTable({ isArchived }: JobsTableProps) {
  const [jobs, setJobs] = useState<JobAdminResponse[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await adminFetch<PaginatedResponse<JobAdminResponse>>("/jobs", {
        params: {
          page: String(currentPage),
          page_size: String(PAGE_SIZE_TABLE),
          is_archived: String(isArchived),
          ...(search && { keyword: search }),
          ...(typeFilter !== "all" && { job_type: typeFilter }),
          ...(!isArchived && statusFilter !== "all" && { status: statusFilter }),
        },
      })
      setJobs(data.data)
      setTotalPages(data.meta.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, search, typeFilter, statusFilter, isArchived])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleArchive = async (jobId: number) => {
    try {
      await adminFetch(`/jobs/${jobId}`, { method: "DELETE" })
      setJobs((prev) => prev.filter((j) => j.id !== jobId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive job")
    }
  }

  if (isLoading) return <PageLoader />
  if (error) return <PageError message={error} action={{ label: "Try Again", onClick: fetchJobs }} />

  return (
    <>
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1) }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="full_time">Full Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
          {!isArchived && (
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Headcount</TableHead>
              <TableHead>Status</TableHead>
              {!isArchived && <TableHead>Urgent</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isArchived ? 6 : 7} className="py-8 text-center text-muted-foreground">
                  {isArchived ? "No archived jobs found." : "No jobs found"}
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{formatJobType(job.job_type)}</TableCell>
                  <TableCell>{formatSalaryCompact(job.min_salary, job.max_salary ?? undefined)}</TableCell>
                  <TableCell>{job.headcount}</TableCell>
                  <TableCell>
                    <Badge variant={!isArchived && job.status === "open" ? "default" : "secondary"}>
                      {isArchived ? "Archived" : job.status}
                    </Badge>
                  </TableCell>
                  {!isArchived && (
                    <TableCell>
                      {job.urgent && <Badge variant="destructive">Urgent</Badge>}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/jobs/${job.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        {!isArchived && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/jobs/${job.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleArchive(job.id)}
                            >
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)}>
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      )}
    </>
  )
}
