"use client"

import * as React from "react"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:bg-success group-[.toaster]:text-success-foreground group-[.toaster]:border-success",
          error: "group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive",
          warning: "group-[.toaster]:bg-warning group-[.toaster]:text-warning-foreground group-[.toaster]:border-warning",
          info: "group-[.toaster]:bg-info group-[.toaster]:text-info-foreground group-[.toaster]:border-info",
        },
        duration: 4000,
      }}
      {...props}
    />
  )
}

export const notify = {
  success: (message: string, description?: string) => toast.success(message, { description }),
  error: (message: string, description?: string) => toast.error(message, { description }),
  warning: (message: string, description?: string) => toast.warning(message, { description }),
  info: (message: string, description?: string) => toast.info(message, { description }),
  loading: (message: string) => toast.loading(message),
  promise: toast.promise,
};

export { Toaster }
