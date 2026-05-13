"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPublicJobs } from "@/lib/actions/public.action"
import { formatJobType, formatSalaryCompact } from "@/lib/utils/format.utils"
import type { JobPublicResponse } from "@/lib/models/job.model"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<JobPublicResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getPublicJobs({ page: 1, page_size: 3 })
      .then((res) => setFeaturedJobs(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/80 py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-balance lg:text-5xl">
              Join our team
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-primary-foreground/90">
              Be part of a company that&apos;s shaping the future through innovation
              and collaboration.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-background text-foreground hover:bg-background/90"
            >
              <Link href="/careers">Explore Careers</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            We&apos;re Hiring
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : featuredJobs.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No open positions at the moment. Check back soon!
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredJobs.map((job) => (
                <Card key={job.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{formatJobType(job.job_type)}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatSalaryCompact(job.min_salary, job.max_salary ?? undefined)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3">
                      {job.description}
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/careers/${job.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/careers">View All Jobs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
