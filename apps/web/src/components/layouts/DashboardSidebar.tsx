'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@lib/utils';
import { 
  LayoutDashboard, Building2, Globe, FileText, Palette, Image, 
  Calendar, MessageSquare, ClipboardList, PenTool, Star, Sparkles, 
  BookOpen, BarChart2, TrendingUp, Search, FlaskConical, Zap, 
  Bell, Plug, Users, Settings, CreditCard, Shield, Code2, 
  ChevronLeft, ChevronRight, Leaf
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'Practice',
    items: [
      { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
      { icon: Building2, label: 'My Practice', href: '/dashboard/practice' },
    ]
  },
  {
    label: 'Website',
    items: [
      { icon: Globe, label: 'Website', href: '/dashboard/website' },
      { icon: FileText, label: 'Pages', href: '/dashboard/website/pages' },
      { icon: Palette, label: 'Builder', href: '/dashboard/website/builder' },
      { icon: Image, label: 'Media', href: '/dashboard/website/media' },
    ]
  },
  {
    label: 'Clients',
    items: [
      { icon: Calendar, label: 'Bookings', href: '/dashboard/bookings' },
      { icon: MessageSquare, label: 'Inquiries', href: '/dashboard/inquiries' },
      { icon: ClipboardList, label: 'Intake Forms', href: '/dashboard/intake' },
    ]
  },
  {
    label: 'Content',
    items: [
      { icon: PenTool, label: 'Content Studio', href: '/dashboard/content' },
      { icon: Star, label: 'Testimonials', href: '/dashboard/testimonials' },
    ]
  },
  {
    label: 'Intelligence',
    items: [
      { icon: Sparkles, label: 'AI Copilot', href: '/dashboard/ai' },
      { icon: BookOpen, label: 'Knowledge Hub', href: '/dashboard/knowledge' },
      { icon: BarChart2, label: 'Analytics', href: '/dashboard/analytics' },
      { icon: TrendingUp, label: 'Conversion Lab', href: '/dashboard/conversion' },
      { icon: Search, label: 'SEO Center', href: '/dashboard/seo' },
      { icon: FlaskConical, label: 'Experiments', href: '/dashboard/experiments' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { icon: Zap, label: 'Automation', href: '/dashboard/automation' },
      { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
      { icon: Plug, label: 'Integrations', href: '/dashboard/integrations' },
    ]
  },
  {
    label: 'Settings',
    items: [
      { icon: Users, label: 'Team', href: '/dashboard/team' },
      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
      { icon: CreditCard, label: 'Billing', href: '/dashboard/settings/billing' },
      { icon: Shield, label: 'Security', href: '/dashboard/settings/security' },
      { icon: Code2, label: 'Developer', href: '/dashboard/developer' },
    ]
  },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

export default function DashboardSidebar({ collapsed, onToggle, isMobile }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="h-14 flex items-center px-4 border-b border-border">
        <Leaf className="w-6 h-6 text-primary flex-shrink-0" />
        {!collapsed && <span className="ml-3 font-serif font-bold truncate">Acme Therapy</span>}
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="mb-6 px-3">
            {!collapsed && (
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                {section.label}
              </h4>
            )}
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm font-medium transition-colors group",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center px-0"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border">
        {!isMobile && (
          <button 
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors mb-2"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
        <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "px-2")}>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary font-bold text-xs">
            DJ
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate text-foreground">Dr. Jenkins</span>
              <span className="text-xs text-muted-foreground truncate">Owner</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
