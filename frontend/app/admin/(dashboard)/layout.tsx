"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { AdminFooter } from "@/components/admin-footer"
import { AdminContext } from "@/contexts/admin-context"
import { getCurrentUser } from "@/lib/actions/user.action"
import type { UserResponse } from "@/lib/models/user.model"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/admin")
      setIsLoading(false)
      return
    }

    getCurrentUser()
      .then((user) => {
        setCurrentUser(user)
        setIsAuthenticated(true)
      })
      .catch(() => {
        // Token is invalid or expired — clear it and redirect to login
        localStorage.removeItem("access_token")
        router.push("/admin")
      })
      .finally(() => setIsLoading(false))
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminContext.Provider value={{ currentUser }}>
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <main className="flex-1 bg-muted/30">{children}</main>
        <AdminFooter />
      </div>
    </AdminContext.Provider>
  )
}
