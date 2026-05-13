import Link from "next/link"

export function AdminFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/admin/dashboard" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/admin/jobs" className="hover:text-foreground">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/admin/applications" className="hover:text-foreground">
                  Applications
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Helpful Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Contact Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>000-000-0000</li>
              <li>
                <a
                  href="mailto:admin@hiringcompanies.com"
                  className="hover:text-foreground"
                >
                  admin@hiringcompanies.com
                </a>
              </li>
              <li>00/00 Rd Street, Rd Town, Thailand</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
