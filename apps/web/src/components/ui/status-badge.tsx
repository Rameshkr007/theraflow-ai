import * as React from "react"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

export type StatusType = 
  | "ACTIVE" | "PUBLISHED" | "CONNECTED" | "COMPLETED"
  | "DRAFT" | "PENDING" | "DISCONNECTED"
  | "REVIEW" | "RUNNING"
  | "WARNING" | "NEEDS_ATTENTION"
  | "ERROR" | "FAILED" | "CANCELLED"
  | "ARCHIVED" | "INACTIVE"
  | string;

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, label, size = "md", className, ...props }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase();
  
  let variant: "success" | "default" | "info" | "warning" | "error" | "secondary" = "default";
  let strike = false;

  if (["ACTIVE", "PUBLISHED", "CONNECTED", "COMPLETED"].includes(normalizedStatus)) {
    variant = "success";
  } else if (["DRAFT", "PENDING", "DISCONNECTED"].includes(normalizedStatus)) {
    variant = "secondary";
  } else if (["REVIEW", "RUNNING"].includes(normalizedStatus)) {
    variant = "info";
  } else if (["WARNING", "NEEDS_ATTENTION"].includes(normalizedStatus)) {
    variant = "warning";
  } else if (["ERROR", "FAILED", "CANCELLED"].includes(normalizedStatus)) {
    variant = "error";
  } else if (["ARCHIVED", "INACTIVE"].includes(normalizedStatus)) {
    variant = "secondary";
    strike = true;
  }

  const displayLabel = label || status.replace(/_/g, ' ');

  return (
    <Badge 
      variant={variant} 
      size={size}
      className={cn(strike && "line-through opacity-70", className)}
      {...props}
    >
      {displayLabel}
    </Badge>
  );
}
StatusBadge.displayName = "StatusBadge"
