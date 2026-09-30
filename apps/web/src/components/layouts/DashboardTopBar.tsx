"use client";

'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Search, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Simple title generator based on route
  const getPageTitle = () => {
    if (!pathname) return 'Dashboard';
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return 'Overview';
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-background">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-1 -ml-1 text-muted-foreground" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button 
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 hover:bg-muted border border-border rounded-md transition-colors"
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
        >
          <Search className="w-4 h-4" />
          <span>Search...</span>
          <kbd className="ml-4 px-1.5 py-0.5 rounded text-[10px] font-medium bg-background border border-border">âŒ˜K</kbd>
        </button>

        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
        </button>

        <div className="relative">
          <button 
            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <User className="w-4 h-4 text-primary" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground">Dr. Sarah Jenkins</p>
                <p className="text-xs text-muted-foreground truncate">sarah@acmetherapy.com</p>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted">Profile</button>
              <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted">Switch Practice</button>
              <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted">Settings</button>
              <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted">Help</button>
              <div className="border-t border-border mt-1 pt-1">
                <button className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-muted">Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
