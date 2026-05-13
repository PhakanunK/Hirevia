"use client"

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
import { useCareers, SALARY_RANGES } from "@/hooks/use-careers"
import { formatJobType, formatSalaryCompact } from "@/lib/utils/format.utils"
import type { JobPublicResponse } from "@/lib/models/job.model"
import { Search, Loader2, AlertCircle } from "lucide-react"

function JobCard({ job }: { job: JobPublicResponse }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base text-primary">{job.title}</CardTitle>
          {job.urgent && (
            <Badge variant="destructive" className="ml-2 shrink-0">Urgent</Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{formatJobType(job.job_type)}</span>
          <span className="hidden sm:inline">|</span>
          <span>{formatSalaryCompact(job.min_salary, job.max_salary ?? undefined)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {job.headcount} open position{job.headcount !== 1 ? "s" : ""}
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
  const {
    jobs, isLoading, error, search, salaryRange, typeFilter,
    currentPage, totalPages, setSearch, setSalaryRange, setTypeFilter,
    setCurrentPage, retry,
  } = useCareers()

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
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Select value={salaryRange} onValueChange={setSalaryRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Salary" />
            </SelectTrigger>
            <SelectContent>
              {SALARY_RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
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
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={retry}>Try Again</Button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No jobs found matching your criteria.
        </div>
      ) : (
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
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
