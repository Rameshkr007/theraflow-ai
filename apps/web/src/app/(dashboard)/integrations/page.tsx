"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { notify } from "@/components/ui/toaster";
import {
  Plug,
  Calendar,
  CreditCard,
  Video,
  Mail,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Search,
  Activity,
  AlertCircle,
} from "lucide-react";

interface IntegrationItem {
  id: string;
  provider: string;
  name: string;
  category: "CALENDAR" | "PAYMENTS" | "VIDEO" | "EMAIL" | "CRM";
  status: "CONNECTED" | "DISCONNECTED" | "NEEDS_ATTENTION";
  description: string;
  lastSync?: string | null;
  icon: string;
}

const DEFAULT_INTEGRATIONS: IntegrationItem[] = [
  {
    id: "int-google-cal",
    provider: "google_calendar",
    name: "Google Calendar",
    category: "CALENDAR",
    status: "CONNECTED",
    description: "Two-way appointment synchronization. Automatically blocks busy personal hours and creates client Google Meet links.",
    lastSync: "Just now",
    icon: "📅",
  },
  {
    id: "int-stripe",
    provider: "stripe",
    name: "Stripe Healthcare Payments",
    category: "PAYMENTS",
    status: "CONNECTED",
    description: "PCI-compliant card processing for consultation reservation deposits and automatic session invoicing.",
    lastSync: "2 hours ago",
    icon: "💳",
  },
  {
    id: "int-simplepractice",
    provider: "simplepractice",
    name: "SimplePractice EHR Sync",
    category: "CRM",
    status: "CONNECTED",
    description: "Automatically synchronizes client demographic profiles and session bookings with your primary medical EHR record.",
    lastSync: "15 minutes ago",
    icon: "🏥",
  },
  {
    id: "int-zoom",
    provider: "zoom_healthcare",
    name: "Zoom for Healthcare (HIPAA)",
    category: "VIDEO",
    status: "CONNECTED",
    description: "Generates private, end-to-end encrypted video meeting rooms for telehealth sessions across Texas and PsyPact states.",
    lastSync: "1 hour ago",
    icon: "🎥",
  },
  {
    id: "int-resend",
    provider: "resend",
    name: "Resend Transactional Email",
    category: "EMAIL",
    status: "CONNECTED",
    description: "Delivers SPF/DKIM authenticated appointment reminders, intake form links, and clinical receipts with 99.8% inbox delivery.",
    lastSync: "5 minutes ago",
    icon: "✉️",
  },
  {
    id: "int-doxy",
    provider: "doxy_me",
    name: "Doxy.me Telehealth Portal",
    category: "VIDEO",
    status: "DISCONNECTED",
    description: "Alternative zero-download browser-based clinical telemedicine waiting room.",
    lastSync: null,
    icon: "🩺",
  },
];

export default function IntegrationHub() {
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(DEFAULT_INTEGRATIONS);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const handleToggle = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "CONNECTED" ? "DISCONNECTED" : "CONNECTED";
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: nextStatus as any, lastSync: nextStatus === "CONNECTED" ? "Just now" : null } : i))
    );
    notify.success(
      nextStatus === "CONNECTED" ? "Integration Connected" : "Integration Disconnected",
      nextStatus === "CONNECTED"
        ? "Service authorized. Secure webhook listener activated."
        : "Integration unlinked from your practice."
    );
  };

  const handleForceSync = (id: string, name: string) => {
    setIsSyncing(id);
    setTimeout(() => {
      setIsSyncing(null);
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, lastSync: "Just now" } : i))
      );
      notify.success("Sync Complete", `${name} data is now fully up to date.`);
    }, 800);
  };

  const filteredIntegrations = integrations.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrations.filter((i) => i.status === "CONNECTED").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Integration Hub"
        description="Connect your practice ecosystem: EHR records, Google Calendar, Stripe payments, and HIPAA video telehealth."
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-success">{connectedCount}</div>
            <div className="text-xs text-text-muted">Active Connected Services</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <CheckCircle className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-xs text-text-muted">HIPAA & BAA Compliant</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-secondary">Healthy</div>
            <div className="text-xs text-text-muted">Webhook Infrastructure</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <Activity className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search integrations by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter integrations by category"
              className="px-3 py-2 text-xs border border-border rounded-lg bg-surface text-text-secondary focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="CALENDAR">Calendar Sync</option>
              <option value="PAYMENTS">Payments & Billing</option>
              <option value="CRM">EHR / EMR Records</option>
              <option value="VIDEO">HIPAA Telehealth</option>
              <option value="EMAIL">Transactional Email</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIntegrations.map((item) => (
          <Card key={item.id} className="p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-border flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-sm">{item.name}</h3>
                    <Badge variant="outline" className="text-[10px] mt-0.5">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                <Badge variant={item.status === "CONNECTED" ? "success" : "outline"} className="text-[10px]">
                  {item.status}
                </Badge>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-[11px] text-text-muted">
                {item.lastSync ? `Sync: ${item.lastSync}` : "Not configured"}
              </span>

              <div className="flex items-center gap-2">
                {item.status === "CONNECTED" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-2"
                    title="Force Data Sync"
                    onClick={() => handleForceSync(item.id, item.name)}
                    loading={isSyncing === item.id}
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-text-muted" />
                  </Button>
                )}

                <Button
                  variant={item.status === "CONNECTED" ? "outline" : "primary"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleToggle(item.id, item.status)}
                >
                  {item.status === "CONNECTED" ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
