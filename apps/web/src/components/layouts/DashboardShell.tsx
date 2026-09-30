"use client";

import React, { useState, useEffect, useRef } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopBar from './DashboardTopBar';
import CommandPalette from '../dashboard/CommandPalette';
import { cn } from '@/lib/utils';
import { ArrowUp, PanelLeftClose, PanelLeft } from 'lucide-react';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Monitor scroll in the main content container to display floating back-to-top button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowBackToTop(scrollTop > 350);
  };

  const scrollToTop = () => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-background flex flex-col md:flex-row antialiased">
      <CommandPalette />

      {/* ──────────────────────────────────────────────────────────────────────────
          1. SMART STICKY DESKTOP SIDEBAR (Never scrolls away with page content)
      ────────────────────────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out border-r border-border/80 bg-card/90 backdrop-blur-xl select-none flex-shrink-0 shadow-xs",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. MAIN VIEWPORT (Fixed TopBar + Independently Scrollable Content Area)
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative">
        {/* Sticky Top Bar */}
        <header className="sticky top-0 z-20 flex-shrink-0 bg-background/80 backdrop-blur-md border-b border-border/80">
          <DashboardTopBar onMenuClick={() => setMobileMenuOpen(true)} />
        </header>

        {/* Independent Smooth-Scroll Main Area */}
        <main
          ref={mainScrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-contain scroll-smooth p-4 md:p-6 lg:p-8 relative focus:outline-none"
        >
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>

          {/* Smart Floating Back-to-Top Button */}
          {showBackToTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold group backdrop-blur-md"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span className="hidden sm:inline pr-1">Top</span>
            </button>
          )}
        </main>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          3. MOBILE SIDEBAR DRAWER (Full screen backdrop with touch dismiss)
      ────────────────────────────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 h-full bg-card border-r border-border shadow-2xl flex flex-col z-10 animate-slide-in-down">
            <DashboardSidebar
              collapsed={false}
              onToggle={() => setMobileMenuOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}
    </div>
  );
}
