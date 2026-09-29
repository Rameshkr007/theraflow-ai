import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, ...props }, ref) => {
    return (
      <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2.5">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center gap-1.5 sm:gap-2.5">
                {isLast ? (
                  <span
                    role="link"
                    aria-disabled="true"
                    aria-current="page"
                    className="font-normal text-foreground"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                )}
                {!isLast && (
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"

export { Breadcrumb }
