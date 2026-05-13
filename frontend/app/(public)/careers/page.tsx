"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { publicFetch } from "@/lib/api"
import { formatJobType, formatSalaryCompact } from "@/lib/format"
import type { Job } from "@/lib/types"
import { Search, Loader2 } from "lucide-react"

const JOBS_PER_PAGE = 6

function JobCard({ job }: { job: Job }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base text-primary">{job.title}</CardTitle>
          {job.urgent && (
            <Badge variant="destructive" className="ml-2 shrink-0">
              Urgent
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Type: {formatJobType(job.type)}</span>
          <span className="hidden sm:inline">|</span>
          <span>Salary: {formatSalaryCompact(job.salary_min, job.salary_max)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Open positions: {job.headcount}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3">
          {job.description}
        </p>
        <Button asChild className="w-full">
          <Link href={`/careers/${job.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [salaryFilter, setSalaryFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await publicFetch<Job[]>('/jobs')
      // Only show open jobs to public
      setJobs(data.filter((job) => job.status === "open"))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter
      if (
        search &&
        !job.title.toLowerCase().includes(search.toLowerCase()) &&
        !job.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return false
      }

      // Salary filter - check if job salary overlaps with selected range
      if (salaryFilter !== "all") {
        const [filterMin, filterMax] = salaryFilter.split("-").map(Number)
        const jobMax = job.salary_max ?? job.salary_min
        // Job overlaps if job_min <= filter_max AND job_max >= filter_min
        const overlaps = filterMax 
          ? job.salary_min <= filterMax && jobMax >= filterMin
          : jobMax >= filterMin // For "80000+" case (no max)
        if (!overlaps) return false
      }

      // Type filter
      if (typeFilter !== "all" && job.type !== typeFilter) {
        return false
      }

      return true
    })
  }, [jobs, search, salaryFilter, typeFilter])

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  )

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">Careers</h1>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold">Careers</h1>
        <div className="py-12 text-center">
          <p className="mb-4 text-destructive">{error}</p>
          <Button onClick={fetchJobs}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Careers</h1>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for position"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              handleFilterChange()
            }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Select
            value={salaryFilter}
            onValueChange={(value) => {
              setSalaryFilter(value)
              handleFilterChange()
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Salary" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="0-15000">฿0 - ฿15K</SelectItem>
              <SelectItem value="15000-30000">฿15K - ฿30K</SelectItem>
              <SelectItem value="30000-50000">฿30K - ฿50K</SelectItem>
              <SelectItem value="50000-80000">฿50K - ฿80K</SelectItem>
              <SelectItem value="80000-">฿80K+</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value)
              handleFilterChange()
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="full_time">Full Time</SelectItem>
              <SelectItem value="part_time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Job Cards */}
      {paginatedJobs.length > 0 ? (
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          No jobs found matching your criteria.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
