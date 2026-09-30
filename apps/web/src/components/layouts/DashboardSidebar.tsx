"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Building2, Globe, FileText, Palette, Image, 
  Calendar, MessageSquare, ClipboardList, PenTool, Star, Sparkles, 
  BookOpen, BarChart2, TrendingUp, Search, FlaskConical, Zap, 
  Bell, Plug, Users, Settings, CreditCard, Shield, Code2, 
  ChevronLeft, ChevronRight, Leaf, Stethoscope, FileCheck, AlertOctagon, Video, HeartHandshake
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'Practice',
    items: [
      { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
      { icon: Building2, label: 'My Practice', href: '/practice' },
    ]
  },
  {
    label: 'Clinical & Billing',
    items: [
      { icon: Stethoscope, label: 'AI SOAP Scribe', href: '/clinical/notes' },
      { icon: FileCheck, label: 'Superbills (CMS-1500)', href: '/billing/superbills' },
      { icon: AlertOctagon, label: 'Crisis 988 Guardian', href: '/crisis' },
      { icon: Video, label: 'Telehealth Room', href: '/telehealth/session-elena-01' },
      { icon: HeartHandshake, label: 'Client Portal', href: '/portal' },
    ]
  },
  {
    label: 'Website',
    items: [
      { icon: Globe, label: 'Website', href: '/website' },
      { icon: FileText, label: 'Pages', href: '/website/pages' },
      { icon: Palette, label: 'Builder', href: '/website/builder' },
      { icon: Image, label: 'Media', href: '/website/media' },
    ]
  },
  {
    label: 'Clients',
    items: [
      { icon: Calendar, label: 'Bookings', href: '/bookings' },
      { icon: MessageSquare, label: 'Inquiries', href: '/inquiries' },
      { icon: ClipboardList, label: 'Intake Forms', href: '/intake' },
    ]
  },
  {
    label: 'Content',
    items: [
      { icon: PenTool, label: 'Content Studio', href: '/content' },
      { icon: Star, label: 'Testimonials', href: '/testimonials' },
    ]
  },
  {
    label: 'Intelligence',
    items: [
      { icon: Sparkles, label: 'AI Copilot', href: '/ai' },
      { icon: BookOpen, label: 'Knowledge Hub', href: '/knowledge' },
      { icon: BarChart2, label: 'Analytics', href: '/analytics' },
      { icon: TrendingUp, label: 'Conversion Lab', href: '/conversion' },
      { icon: Search, label: 'SEO Center', href: '/seo' },
      { icon: FlaskConical, label: 'Experiments', href: '/experiments' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { icon: Zap, label: 'Automation', href: '/automation' },
      { icon: Bell, label: 'Notifications', href: '/notifications' },
      { icon: Plug, label: 'Integrations', href: '/integrations' },
    ]
  },
  {
    label: 'Settings',
    items: [
      { icon: Users, label: 'Team', href: '/team' },
      { icon: Settings, label: 'Settings', href: '/settings' },
      { icon: CreditCard, label: 'Billing', href: '/settings/billing' },
      { icon: Shield, label: 'Security', href: '/settings/security' },
      { icon: Code2, label: 'Developer', href: '/developer' },
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
      {/* Brand Practice Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/80 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary flex-shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-serif font-bold text-sm text-foreground truncate">Willow & Mind</span>
              <span className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-mono">Therapy OS</span>
            </div>
          )}
        </Link>
      </div>

      {/* Independently Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-thin scrollbar-thumb-border-strong overscroll-contain">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <h4 className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider px-2.5 mb-1.5">
                {section.label}
              </h4>
            )}
            <div className="space-y-0.5">
              {section.items.map((item, itemIdx) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(`${item.href}`));
                const Icon = item.icon;
                
                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all relative group",
                      isActive 
                        ? "bg-primary/10 text-primary shadow-xs font-bold before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-primary before:rounded-r-full" 
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                      collapsed && "justify-center px-0 py-2.5"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={cn(
                      "w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile & Collapse Toggle */}
      <div className="p-3 border-t border-border/80 flex-shrink-0 bg-background/50">
        {!isMobile && (
          <button 
            onClick={onToggle}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-all text-xs font-medium mb-2 group"
            title={collapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
          >
            {!collapsed && <span className="text-[11px] text-muted-foreground group-hover:text-foreground">Collapse</span>}
            <div className="flex items-center gap-1">
              {!collapsed && <span className="text-[9px] font-mono px-1 rounded bg-muted text-muted-foreground">Ctrl+B</span>}
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </div>
          </button>
        )}

        <div className={cn("flex items-center gap-2.5", collapsed ? "justify-center" : "px-1")}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-emerald-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-xs">
            DJ
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold truncate text-foreground">Dr. Sarah Jenkins</span>
              <span className="text-[10px] text-emerald-600 font-medium truncate">Licensed Clinician (PsyD)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
