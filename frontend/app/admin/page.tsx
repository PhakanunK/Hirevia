"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useLogin } from "@/hooks/use-login"
import { ShieldAlert } from "lucide-react"

function SessionBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("auth_banner")) {
      sessionStorage.removeItem("auth_banner")
      setShow(true)
    }
  }, [])

  if (!show) return null
  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <span>
        Your session has ended. If your account was suspended, please contact an administrator.
      </span>
    </div>
  )
}

export default function AdminLoginPage() {
  const { email, setEmail, password, setPassword, isLoading, error, handleSubmit } = useLogin()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Hirevia</CardTitle>
          <CardDescription>
            Lightweight Applicant Tracking &amp; Hiring Pipeline System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionBanner />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have? Contact Support here
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
