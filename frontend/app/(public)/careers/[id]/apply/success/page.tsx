import Link from "next/link"
import { FileCheck } from "lucide-react"

export default async function ApplySuccessPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Generate a mock token for tracking
  const trackingToken = `tk_${Math.random().toString(36).substring(2, 10)}`

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="mb-8 text-2xl font-bold text-green-600">
        Your application has been submitted
      </h1>

      <div className="mb-8 flex justify-center">
        <div className="rounded-full bg-green-100 p-6">
          <FileCheck className="h-16 w-16 text-green-600" />
        </div>
      </div>

      <p className="mb-4 text-muted-foreground">
        Thank you for applying for the position.
      </p>
      <p className="mb-6 text-muted-foreground">
        You can track your application status via email or through this link:
      </p>

      <Link
        href={`/status?token=${trackingToken}`}
        className="text-primary underline underline-offset-4 hover:text-primary/80"
      >
        https://www.company/status/{trackingToken}
      </Link>
    </div>
  )
}
