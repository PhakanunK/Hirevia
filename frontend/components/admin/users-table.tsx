"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageLoader, PageError } from "@/components/ui/page-states"
import { USER_STATUS_CONFIG, USER_ROLE_CONFIG, PAGE_SIZE_TABLE } from "@/lib/utils/constants"
import { getUsers } from "@/lib/actions/user.action"
import type { UserResponse } from "@/lib/models/user.model"
import { Search, Eye, MoreHorizontal } from "lucide-react"

export function UsersTable() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getUsers({
        page: currentPage,
        page_size: PAGE_SIZE_TABLE,
        keyword: search || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
      setUsers(data.data)
      setTotalPages(data.meta.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, search, roleFilter, statusFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  if (isLoading) return <PageLoader />
  if (error) return <PageError message={error} action={{ label: "Try Again", onClick: fetchUsers }} />

  return (
    <>
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by username or email"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1) }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="head_admin">Head Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={USER_ROLE_CONFIG[user.role].color}>
                      {USER_ROLE_CONFIG[user.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={USER_STATUS_CONFIG[user.status].color}>
                      {USER_STATUS_CONFIG[user.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)}>
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      )}
    </>
  )
}
