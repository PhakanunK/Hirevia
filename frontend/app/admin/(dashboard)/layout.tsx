"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
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
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null)
  const didInitialFetch = useRef(false)

  // Initial auth check — runs once on mount
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
        didInitialFetch.current = true
      })
      .catch(() => {
        localStorage.removeItem("access_token")
        router.push("/admin")
      })
      .finally(() => setIsLoading(false))
  }, [router])

  // Listen for forced logout events dispatched by adminFetch on 401.
  // Using React router here avoids the hard-reload flicker of window.location.
  useEffect(() => {
    const handleForceLogout = () => {
      setIsAuthenticated(false)
      router.push("/admin")
    }
    window.addEventListener("auth:unauthorized", handleForceLogout)
    return () => window.removeEventListener("auth:unauthorized", handleForceLogout)
  }, [router])

  // Re-fetch current user on each navigation so role changes (promotion / demotion)
  // are reflected in the header without requiring a logout.
  useEffect(() => {
    if (!didInitialFetch.current) return
    getCurrentUser()
      .then(setCurrentUser)
      .catch(() => {})
  }, [pathname])

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
