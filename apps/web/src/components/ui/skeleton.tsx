import * as React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "circle" | "rectangle" | "card";
}

function Skeleton({
  className,
  variant = "rectangle",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        variant === "line" && "h-4 w-full rounded-md",
        variant === "circle" && "rounded-full h-10 w-10",
        variant === "rectangle" && "rounded-md",
        variant === "card" && "rounded-lg h-32 w-full",
        className
      )}
      {...props}
    />
  )
}
Skeleton.displayName = "Skeleton"

const SkeletonLine = ({ className, ...props }: SkeletonProps) => <Skeleton variant="line" className={className} {...props} />
const SkeletonCard = ({ className, ...props }: SkeletonProps) => <Skeleton variant="card" className={className} {...props} />
const SkeletonAvatar = ({ className, ...props }: SkeletonProps) => <Skeleton variant="circle" className={className} {...props} />
const SkeletonText = ({ lines = 3, className, ...props }: SkeletonProps & { lines?: number }) => (
  <div className={cn("space-y-2", className)} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="line" className={i === lines - 1 ? "w-2/3" : "w-full"} />
    ))}
  </div>
)

SkeletonLine.displayName = "SkeletonLine"
SkeletonCard.displayName = "SkeletonCard"
SkeletonAvatar.displayName = "SkeletonAvatar"
SkeletonText.displayName = "SkeletonText"

export { Skeleton, SkeletonLine, SkeletonCard, SkeletonAvatar, SkeletonText }
