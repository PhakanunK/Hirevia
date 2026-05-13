import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockJobs } from "@/lib/mock-data"
import { formatJobType, formatSalaryCompact } from "@/lib/format"

export default function HomePage() {
  const featuredJobs = mockJobs.filter((job) => job.status === "open").slice(0, 3)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-primary/80 py-20 text-primary-foreground">
        <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-2">
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
          <div className="relative hidden aspect-[4/3] lg:block">
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <Image
                src="/images/hero-team.jpg"
                alt="Team collaboration"
                width={500}
                height={375}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            We&apos;re Hiring
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{formatJobType(job.type)}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatSalaryCompact(job.salary_min, job.salary_max)}
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
