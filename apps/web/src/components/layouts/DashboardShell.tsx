'use client';

import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopBar from './DashboardTopBar';
import CommandPalette from '../dashboard/CommandPalette';
import { cn } from '@lib/utils';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <CommandPalette />
      
      {/* Sidebar - Desktop */}
      <div className={cn(
        "hidden md:block transition-all duration-300 border-r border-border bg-muted/30",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <DashboardSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopBar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 h-full bg-background border-r border-border shadow-xl">
            <DashboardSidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} isMobile />
          </div>
        </div>
      )}
    </div>
  );
}
