"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        underline: "bg-transparent p-0 border-b rounded-none w-full justify-start space-x-4",
        pill: "bg-muted",
        enclosed: "bg-muted/50 p-2",
      }
    },
    defaultVariants: {
      variant: "underline"
    }
  }
)

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsListContext = React.createContext<{ variant?: "underline" | "pill" | "enclosed" | null }>({ variant: "underline" })

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => (
  <TabsListContext.Provider value={{ variant }}>
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  </TabsListContext.Provider>
))
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        underline: "rounded-none border-b-2 border-transparent px-2 py-3 data-[state=active]:border-primary data-[state=active]:text-foreground",
        pill: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        enclosed: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      }
    },
    defaultVariants: {
      variant: "underline"
    }
  }
)

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TabsListContext)
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
