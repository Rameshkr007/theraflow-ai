import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { SkeletonLine, SkeletonCard } from "./skeleton"
import { cn } from "@/lib/utils"

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: {
    value: number;
    direction: "up" | "down" | "neutral";
    label: string;
  };
  icon: LucideIcon;
  loading?: boolean;
  isDemoData?: boolean;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, change, icon: Icon, loading, isDemoData, ...props }, ref) => {
    if (loading) {
      return (
        <Card className={className} ref={ref} {...props}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <SkeletonLine className="w-1/2" />
            <SkeletonLine className="w-4 h-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <SkeletonLine className="w-1/3 h-8 mb-2" />
            <SkeletonLine className="w-2/3 h-4" />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card ref={ref} className={className} {...props}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {label}
            {isDemoData && <Badge variant="secondary" size="sm" className="ml-2">DEMO</Badge>}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className={cn(
                "mr-1 font-medium",
                change.direction === 'up' && "text-success",
                change.direction === 'down' && "text-destructive",
                change.direction === 'neutral' && "text-muted-foreground",
              )}>
                {change.direction === 'up' && '+'}
                {change.direction === 'down' && '-'}
                {change.value}%
              </span>
              {" "}{change.label}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }
)
StatCard.displayName = "StatCard"

export { StatCard }
