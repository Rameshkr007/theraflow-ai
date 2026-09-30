"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { notify } from "@/components/ui/toaster";
import {
  CreditCard,
  CheckCircle,
  Sparkles,
  Layers,
  Calendar,
  Download,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface InvoiceItem {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: "PAID" | "PENDING";
}

const INVOICES: InvoiceItem[] = [
  { id: "inv-2024-09", date: "Sep 1, 2024", amount: "$79.00", plan: "Professional Tier", status: "PAID" },
  { id: "inv-2024-08", date: "Aug 1, 2024", amount: "$79.00", plan: "Professional Tier", status: "PAID" },
  { id: "inv-2024-07", date: "Jul 1, 2024", amount: "$79.00", plan: "Professional Tier", status: "PAID" },
];

export default function BillingCenter() {
  const [currentPlan, setCurrentPlan] = useState("professional");

  const handleUpgrade = (planName: string) => {
    setCurrentPlan(planName.toLowerCase());
    notify.success("Plan Updated", `Your practice is now on the ${planName} plan.`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Subscription & Billing"
        description="Monitor practice plan limits, manage Stripe billing details, and download historical invoice receipts."
      />

      {/* Active Plan Overview */}
      <Card className="p-6 bg-primary/5 border-primary/20 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-text-primary capitalize">{currentPlan} Plan</span>
              <Badge variant="primary">Active Practice</Badge>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              $79/month billed through Stripe • Renews automatically on October 1, 2024.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => notify.info("Stripe Portal", "Redirecting to Stripe Customer Portal...")}
          >
            Manage Payment Method
          </Button>
        </div>

        {/* Entitlements & Usage Quotas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-secondary" /> AI Token Usage
              </span>
              <strong className="text-text-primary">14.2%</strong>
            </div>
            <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: "14.2%" }} />
            </div>
            <div className="text-[11px] text-text-muted">14,200 of 100,000 monthly tokens</div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" /> Practice Pages
              </span>
              <strong className="text-text-primary">6 / 25</strong>
            </div>
            <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "24%" }} />
            </div>
            <div className="text-[11px] text-text-muted">6 pages published across domains</div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-success" /> Monthly Bookings
              </span>
              <strong className="text-success">Unlimited</strong>
            </div>
            <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
              <div className="bg-success h-full rounded-full" style={{ width: "100%" }} />
            </div>
            <div className="text-[11px] text-text-muted">42 consultations scheduled this month</div>
          </div>
        </div>
      </Card>

      {/* Plan Comparison Tiers */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4">
          Available Subscription Tiers
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <Card className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-text-primary text-base">Starter Solo</h3>
                <p className="text-xs text-text-muted">Ideal for independent solo clinicians.</p>
              </div>
              <div className="text-3xl font-bold text-text-primary">
                $39<span className="text-xs text-text-muted font-normal">/month</span>
              </div>
              <ul className="text-xs text-text-secondary space-y-2.5">
                <li className="flex items-center gap-2">✓ 1 Therapist calendar</li>
                <li className="flex items-center gap-2">✓ Up to 5 practice website pages</li>
                <li className="flex items-center gap-2">✓ Standard client booking & CRM</li>
                <li className="flex items-center gap-2">✓ 25,000 AI Copilot tokens</li>
              </ul>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={currentPlan === "starter"}
              onClick={() => handleUpgrade("Starter")}
            >
              {currentPlan === "starter" ? "Current Plan" : "Downgrade to Starter"}
            </Button>
          </Card>

          {/* Professional (Current) */}
          <Card className="p-6 flex flex-col justify-between space-y-6 border-2 border-primary bg-primary/5 relative">
            <div className="absolute -top-3 right-4 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Current Plan
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-text-primary text-base">Professional Practice</h3>
                <p className="text-xs text-text-muted">For growing practices seeking full AI intelligence.</p>
              </div>
              <div className="text-3xl font-bold text-text-primary">
                $79<span className="text-xs text-text-muted font-normal">/month</span>
              </div>
              <ul className="text-xs text-text-secondary space-y-2.5">
                <li className="flex items-center gap-2">✓ Up to 5 clinician seats</li>
                <li className="flex items-center gap-2">✓ Unlimited practice website pages</li>
                <li className="flex items-center gap-2">✓ 100,000 AI tokens + Smart Composer</li>
                <li className="flex items-center gap-2">✓ Document Intelligence & RAG engine</li>
                <li className="flex items-center gap-2">✓ Custom domain + SSL & Superbills</li>
              </ul>
            </div>
            <Button variant="primary" size="sm" className="w-full" disabled>
              Active Plan
            </Button>
          </Card>

          {/* Growth */}
          <Card className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-text-primary text-base">Growth & Clinics</h3>
                <p className="text-xs text-text-muted">For multi-specialty clinics and group centers.</p>
              </div>
              <div className="text-3xl font-bold text-text-primary">
                $149<span className="text-xs text-text-muted font-normal">/month</span>
              </div>
              <ul className="text-xs text-text-secondary space-y-2.5">
                <li className="flex items-center gap-2">✓ Unlimited clinicians and locations</li>
                <li className="flex items-center gap-2">✓ 500,000 AI tokens / month</li>
                <li className="flex items-center gap-2">✓ White-label client portal branding</li>
                <li className="flex items-center gap-2">✓ Dedicated HIPAA BAA agreement</li>
                <li className="flex items-center gap-2">✓ Priority clinical support</li>
              </ul>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleUpgrade("Growth")}
            >
              Upgrade to Growth
            </Button>
          </Card>
        </div>
      </div>

      {/* Invoice History */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border font-bold text-xs uppercase tracking-wider text-text-secondary">
          Historical Invoices & Receipts
        </div>
        <div className="divide-y divide-border">
          {INVOICES.map((inv) => (
            <div key={inv.id} className="p-4 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-semibold text-text-primary">{inv.plan} - {inv.amount}</div>
                <div className="text-[11px] text-text-muted font-mono">{inv.id} • {inv.date}</div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="success" className="text-[10px]">
                  {inv.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => notify.info("Download Invoice", `Downloading receipt ${inv.id}...`)}
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
