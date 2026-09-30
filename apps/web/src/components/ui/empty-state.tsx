"use client";

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import Link from "next/link"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  variant?: "default" | "compact";
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, title, description, action, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center",
          variant === "default" ? "min-h-[400px] p-8" : "p-6",
          className
        )}
        {...props}
      >
        <div className={cn(
          "flex items-center justify-center rounded-full bg-muted",
          variant === "default" ? "h-20 w-20 mb-6" : "h-12 w-12 mb-4"
        )}>
          <Icon className={cn(
            "text-muted-foreground",
            variant === "default" ? "h-10 w-10" : "h-6 w-6"
          )} />
        </div>
        <h3 className={cn(
          "font-semibold text-foreground",
          variant === "default" ? "text-2xl mb-2" : "text-lg mb-1"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-muted-foreground",
          variant === "default" ? "max-w-sm mb-6" : "max-w-xs text-sm mb-4"
        )}>
          {description}
        </p>
        {action && (
          <div>
            {action.href ? (
              <Button asChild>
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ) : (
              <Button onClick={action.onClick}>{action.label}</Button>
            )}
          </div>
        )}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
