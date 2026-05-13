"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UsersTable } from "@/components/admin/users-table"
import { Plus } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <Button asChild>
          <Link href="/admin/users/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Admin
          </Link>
        </Button>
      </div>
      <UsersTable />
    </div>
  )
}
