import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageHeaderProps {
  className?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, breadcrumb, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-4 pb-6", className)}
        {...props}
      >
        {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      </div>
    )
  }
)
PageHeader.displayName = "PageHeader"

export { PageHeader }
