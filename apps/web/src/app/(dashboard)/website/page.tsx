"use client";

import React from 'react';
import { Globe, Plus, Palette, Settings, ExternalLink, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function WebsiteOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-serif font-bold text-foreground">Website</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              PUBLISHED
            </span>
          </div>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <Globe className="w-4 h-4" />
            acmetherapy.com
            <a href="#" className="text-primary hover:underline flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-background border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Open Builder
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            Publish Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Preview & Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-muted border border-border rounded-xl shadow-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-background/50 backdrop-blur-sm transition-opacity z-10">
              <button className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <Palette className="w-5 h-5" />
                Edit Website
              </button>
            </div>
            <div className="w-full h-8 bg-background border-b border-border flex items-center px-4 gap-2 relative z-0">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="ml-4 h-4 w-48 bg-muted rounded" />
            </div>
            {/* Mock website content area */}
            <div className="p-8">
              <div className="w-1/3 h-8 bg-muted rounded mb-4" />
              <div className="w-2/3 h-4 bg-muted/60 rounded mb-2" />
              <div className="w-1/2 h-4 bg-muted/60 rounded mb-8" />
              <div className="grid grid-cols-3 gap-4">
                <div className="aspect-square bg-muted/40 rounded-lg" />
                <div className="aspect-square bg-muted/40 rounded-lg" />
                <div className="aspect-square bg-muted/40 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-background border border-border rounded-xl shadow-sm text-center">
              <div className="text-2xl font-bold text-foreground mb-1">12</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Pages</div>
            </div>
            <div className="p-4 bg-background border border-border rounded-xl shadow-sm text-center">
              <div className="text-2xl font-bold text-foreground mb-1">92</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">SEO Score</div>
            </div>
            <div className="p-4 bg-background border border-border rounded-xl shadow-sm text-center">
              <div className="text-sm font-bold text-foreground mb-1 mt-1.5">2 days ago</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-2.5">Last Published</div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          
          <div className="p-6 bg-background border border-border rounded-xl shadow-sm">
            <h3 className="font-bold text-foreground mb-4">Pre-Publish Quality Gate</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Mobile Responsiveness</p>
                  <p className="text-xs text-muted-foreground">All pages pass standard layout tests.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Missing Meta Tags</p>
                  <p className="text-xs text-muted-foreground">2 pages are missing custom descriptions.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Broken Links</p>
                  <p className="text-xs text-muted-foreground">No broken links found.</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 bg-muted text-foreground text-sm font-medium rounded-md hover:bg-muted/80 transition-colors">
              Run Full Scan
            </button>
          </div>

          <div className="p-6 bg-background border border-border rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Recent Changes</h3>
              <button className="text-primary hover:underline text-xs font-medium">View history</button>
            </div>
            <div className="space-y-4">
              {[
                { action: 'Updated text', page: 'About Us', time: '2 hours ago' },
                { action: 'Added image', page: 'Services', time: 'Yesterday' },
                { action: 'Published site', page: 'Global', time: '2 days ago' },
              ].map((change, i) => (
                <div key={i} className="flex gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{change.action}</span> on {change.page}
                    </p>
                    <p className="text-xs text-muted-foreground">{change.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
