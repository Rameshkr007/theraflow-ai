"use client";

import React from "react";
import {
  TrendingUp,
  ArrowRight,
  Filter,
  Users,
  Eye,
  MousePointerClick,
  Calendar,
  CheckCircle2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { notify } from "@/components/ui/toast";

export default function ConversionLabPage() {
  const funnelStages = [
    { name: "Website Visitors", count: "10,000", percentage: "100%", dropOff: "0%", icon: Users, color: "bg-blue-500" },
    { name: "Service & Bio Views", count: "6,300", percentage: "63%", dropOff: "37%", icon: Eye, color: "bg-indigo-500" },
    { name: "Booking Button Clicks", count: "2,100", percentage: "21%", dropOff: "67%", icon: MousePointerClick, color: "bg-purple-500" },
    { name: "Booking Form Starts", count: "1,050", percentage: "10.5%", dropOff: "50%", icon: Calendar, color: "bg-emerald-500" },
    { name: "Completed Appointments", count: "720", percentage: "7.2%", dropOff: "31%", icon: CheckCircle2, color: "bg-primary" },
  ];

  const handleApplyAiRecommendation = (rec: string) => {
    notify.success(`AI Recommendation applied: ${rec}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Conversion Lab & Funnel Explorer
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
              7.2% Total Conversion
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze client journey drop-offs from initial discovery through completed therapy intake and booking.
          </p>
        </div>
      </div>

      {/* Funnel Visualizer */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
          <Filter className="w-4 h-4 text-primary" />
          End-to-End Client Acquisition Funnel
        </h3>

        <div className="space-y-4">
          {funnelStages.map((stage, idx) => (
            <div key={idx} className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-medium">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md text-white ${stage.color}`}>
                    <stage.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-foreground">{stage.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">Drop-off: {stage.dropOff}</span>
                  <span className="font-bold text-foreground font-mono">{stage.count} ({stage.percentage})</span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${stage.color}`}
                  style={{ width: stage.percentage }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Friction Points & Optimizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Friction Points */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Detected Conversion Friction Points
          </h3>
          <div className="space-y-2.5 text-xs text-muted-foreground">
            <div className="p-3 bg-muted/40 rounded-lg border border-border">
              <strong className="text-foreground">Service View → Booking Click Drop-off (67%)</strong>
              <p className="mt-1">
                Clients spend an average of 42 seconds on the "Couples Therapy" service page without scrolling to the fee structure.
              </p>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg border border-border">
              <strong className="text-foreground">Booking Start → Completion Drop-off (31%)</strong>
              <p className="mt-1">
                Clients hesitate when asked for credit card pre-authorization before initial consultation confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Conversion Recommendations
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-background rounded-lg border border-primary/20 space-y-2">
              <p className="font-medium text-foreground">
                Add Out-of-Network Superbill reimbursement notice above the booking button.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 font-semibold text-[11px]">Est. Impact: +14% bookings</span>
                <button
                  onClick={() => handleApplyAiRecommendation("Superbill reimbursement notice")}
                  className="px-2.5 py-1 bg-primary text-primary-foreground rounded text-[11px] font-semibold hover:bg-primary/90"
                >
                  Apply to Website
                </button>
              </div>
            </div>

            <div className="p-3 bg-background rounded-lg border border-primary/20 space-y-2">
              <p className="font-medium text-foreground">
                Enable 15-minute free discovery call option alongside direct paid appointments.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 font-semibold text-[11px]">Est. Impact: +22% inquiries</span>
                <button
                  onClick={() => handleApplyAiRecommendation("15-minute discovery call")}
                  className="px-2.5 py-1 bg-primary text-primary-foreground rounded text-[11px] font-semibold hover:bg-primary/90"
                >
                  Apply to Website
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
