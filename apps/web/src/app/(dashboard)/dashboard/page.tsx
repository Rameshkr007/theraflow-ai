"use client";

import React from 'react';
import { Calendar, Users, Globe, Brain, Plus, UserPlus, BarChart } from 'lucide-react';

export default function DashboardOverviewPage() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">{greeting}, Dr. Jenkins</h1>
          <p className="text-muted-foreground mt-1">{dateStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-background border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Invite Team
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Page
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Bookings this week', value: '24', trend: '+12%', icon: Calendar },
          { label: 'New inquiries', value: '7', trend: '+2', icon: Users },
          { label: 'Website visitors', value: '1,248', trend: '+18%', icon: Globe },
          { label: 'AI tasks completed', value: '156', trend: 'Saved 5h', icon: Brain },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-background border border-border rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className="p-2 bg-primary/10 rounded-md">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{stat.value}</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Website Health */}
          <div className="p-6 bg-background border border-border rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Website Health</h2>
              <button className="text-sm text-primary hover:underline font-medium">View details</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-medium text-sm text-foreground">SEO Score: 92/100</span>
                </div>
                <span className="text-xs text-muted-foreground">Excellent</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-medium text-sm text-foreground">Mobile Performance: 78/100</span>
                </div>
                <span className="text-xs text-muted-foreground text-amber-600">Needs improvement</span>
              </div>
            </div>
          </div>

          {/* Content Quality */}
          <div className="p-6 bg-background border border-border rounded-xl shadow-sm">
            <h2 className="text-lg font-bold text-foreground mb-6">Content Quality Gate</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-foreground mb-1">12</div>
                <div className="text-xs text-muted-foreground">Published Pages</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-foreground mb-1">3</div>
                <div className="text-xs text-muted-foreground">Drafts</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-amber-600 mb-1">2</div>
                <div className="text-xs text-muted-foreground">AI Suggestions</div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Activity */}
        <div className="space-y-6">
          <div className="p-6 bg-background border border-border rounded-xl shadow-sm h-full">
            <h2 className="text-lg font-bold text-foreground mb-6">Recent Activity</h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
              {[
                { time: '2 hours ago', title: 'New inquiry', desc: 'Mark S. submitted the intake form.' },
                { time: '4 hours ago', title: 'AI completed task', desc: 'Generated draft for "Anxiety Treatment" page.' },
                { time: 'Yesterday', title: 'Booking confirmed', desc: 'Session with Emily R. scheduled for tomorrow.' },
              ].map((activity, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-lg border border-border bg-background shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-sm text-foreground">{activity.title}</div>
                      <time className="text-xs text-muted-foreground">{activity.time}</time>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.desc}</div>
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
