import Link from "next/link"
import { FileCheck } from "lucide-react"

export default async function ApplySuccessPage({
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mb-8 flex justify-center">
        <div className="rounded-full bg-green-100 p-6">
          <FileCheck className="h-16 w-16 text-green-600" />
        </div>
      </div>

      <h1 className="mb-4 text-2xl font-bold text-green-600">
        Application submitted!
      </h1>

      <p className="mb-2 text-muted-foreground">
        Thank you for applying. We&apos;ll review your application and get back to you.
      </p>

      {token ? (
        <>
          <p className="mb-6 text-muted-foreground">
            Track your application status anytime using the link below:
          </p>
          <Link
            href={`/status?token=${token}`}
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Check application status
          </Link>
        </>
      ) : (
        <p className="mb-6 text-muted-foreground">
          A confirmation email with your tracking link has been sent to your inbox.
        </p>
      )}
    </div>
  )
}
