"use client";

'use client';

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
      
      <div className="relative w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground mr-2" />
          <input 
            autoFocus
            className="flex-1 h-12 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
            placeholder="Type a command or search..."
          />
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted border border-border text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Quick Actions</div>
          <button className="w-full text-left px-2 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-md flex items-center">
            Create new page
          </button>
          <button className="w-full text-left px-2 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-md flex items-center">
            Invite team member
          </button>

          <div className="px-2 py-1.5 mt-2 text-xs font-semibold text-muted-foreground">Navigation</div>
          <button className="w-full text-left px-2 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-md flex items-center">
            Go to Analytics
          </button>
          <button className="w-full text-left px-2 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-md flex items-center">
            Go to Settings
          </button>
        </div>
      </div>
    </div>
  );
}
