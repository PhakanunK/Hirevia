import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PageLoader() {
  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-16">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

interface PageErrorProps {
  message: string
  action?: { label: string; onClick: () => void }
}

export function PageError({ message, action }: PageErrorProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
        <p className="text-destructive">{message}</p>
        {action && (
          <Button variant="outline" className="mt-4" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}
