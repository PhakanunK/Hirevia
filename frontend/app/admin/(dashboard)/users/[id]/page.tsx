"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PageLoader, PageError } from "@/components/ui/page-states"
import { useUser } from "@/hooks/use-user"
import { USER_STATUS_CONFIG, USER_ROLE_CONFIG } from "@/lib/utils/constants"
import type { UserRole } from "@/lib/models/user.model"
import { Loader2, Mail, User, Shield, Calendar } from "lucide-react"

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const {
    user, isLoading, error,
    isEditing, isSaving, isSuspending, showSuspendModal,
    editForm, isSelf, canSuspend,
    setIsEditing, setShowSuspendModal, setField,
    handleSave, handleSuspend, cancelEdit,
  } = useUser(id)

  if (isLoading) return <PageLoader />
  if (error && !user) return <PageError message={error} action={{ label: "Back to Users", onClick: () => router.push("/admin/users") }} />
  if (!user) return null

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Admin User</h1>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>{user.username}</CardTitle>
                {isSelf && <Badge variant="secondary">You</Badge>}
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-username">Username</Label>
                    <Input id="edit-username" value={editForm.username ?? ""} onChange={(e) => setField({ username: e.target.value })} disabled={isSaving} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input id="edit-email" type="email" value={editForm.email ?? ""} onChange={(e) => setField({ email: e.target.value })} disabled={isSaving} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-password">New Password</Label>
                    <Input id="edit-password" type="password" placeholder="Leave blank to keep current password" onChange={(e) => setField({ password: e.target.value || null })} disabled={isSaving} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select value={editForm.role ?? user.role} onValueChange={(v) => setField({ role: v as UserRole })} disabled={isSaving || isSelf}>
                      <SelectTrigger id="edit-role"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="head_admin">Head Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {isSelf && <p className="text-xs text-muted-foreground">You cannot change your own role.</p>}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save
                    </Button>
                    <Button variant="outline" onClick={cancelEdit} disabled={isSaving}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user.username}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Badge className={USER_ROLE_CONFIG[user.role].color}>{USER_ROLE_CONFIG[user.role].label}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={USER_STATUS_CONFIG[user.status].color}>{USER_STATUS_CONFIG[user.status].label}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p>{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p>{new Date(user.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {canSuspend && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="sm" className="w-full" onClick={() => setShowSuspendModal(true)} disabled={isSuspending}>
                  {isSuspending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Suspend Account
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Suspend Confirm Modal */}
      <AlertDialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend <strong>{user.username}</strong>? They will immediately lose access to the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSuspending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspend}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSuspending}
            >
              {isSuspending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
