"use client";

import React, { useState } from "react";
import {
  Code2,
  Key,
  Webhook,
  Copy,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Shield,
  Terminal,
} from "lucide-react";
import { notify } from "@/components/ui/toast";

export default function DeveloperPage() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: "key-1",
      name: "Production Practice EHR Sync",
      prefix: "tf_live_948a...",
      createdAt: "Aug 14, 2026",
      lastUsed: "2 hours ago",
      status: "ACTIVE",
    },
    {
      id: "key-2",
      name: "Stripe Webhook Relay",
      prefix: "tf_live_bc12...",
      createdAt: "Sep 01, 2026",
      lastUsed: "Yesterday",
      status: "ACTIVE",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"keys" | "webhooks" | "docs">("keys");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    notify.success("Copied to clipboard!");
  };

  const handleCreateKey = () => {
    const name = prompt("Enter a description for this API key:", "Zapier Booking Integration");
    if (!name) return;

    const newKey = {
      id: `key-${Date.now()}`,
      name,
      prefix: `tf_live_${Math.random().toString(36).substring(2, 8)}...`,
      createdAt: "Just now",
      lastUsed: "Never",
      status: "ACTIVE",
    };
    setApiKeys([...apiKeys, newKey]);
    notify.success("New API key generated!");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Developer Platform & REST APIs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 font-mono">
              v1.0 API
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Programmatically integrate your therapy website, EHR scheduling, webhooks, and billing exports.
          </p>
        </div>

        <div className="flex items-center bg-muted p-1 rounded-lg border border-border text-xs">
          <button
            onClick={() => setActiveTab("keys")}
            className={`px-3 py-1.5 rounded-md font-semibold ${
              activeTab === "keys" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            API Keys
          </button>
          <button
            onClick={() => setActiveTab("webhooks")}
            className={`px-3 py-1.5 rounded-md font-semibold ${
              activeTab === "webhooks" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            Webhooks
          </button>
          <button
            onClick={() => setActiveTab("docs")}
            className={`px-3 py-1.5 rounded-md font-semibold ${
              activeTab === "docs" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
            }`}
          >
            API Docs
          </button>
        </div>
      </div>

      {/* Tab: API Keys */}
      {activeTab === "keys" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              API keys allow external systems to access appointment calendars, intake submissions, and superbills.
            </p>
            <button
              onClick={handleCreateKey}
              className="px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Create API Key
            </button>
          </div>

          <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4">Key Label</th>
                  <th className="py-3 px-4">Key Token</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4">Last Used</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {apiKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">{k.name}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{k.prefix}</td>
                    <td className="py-3 px-4 text-muted-foreground">{k.createdAt}</td>
                    <td className="py-3 px-4 text-muted-foreground">{k.lastUsed}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                        {k.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleCopy(k.prefix)}
                        className="px-2 py-1 bg-muted hover:bg-primary hover:text-primary-foreground rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Webhooks */}
      {activeTab === "webhooks" && (
        <div className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Webhook className="w-4 h-4 text-primary" />
              Event Webhook Endpoints
            </h3>
            <span className="text-xs text-muted-foreground">HTTP POST Deliveries</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-lg border border-border bg-muted/30 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-foreground">https://api.my-practice-ehr.com/webhooks/theraflow</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Subscribed events: <code>booking.created</code>, <code>intake.submitted</code>, <code>superbill.issued</code>
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                ACTIVE · 200 OK
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: API Docs */}
      {activeTab === "docs" && (
        <div className="p-6 rounded-xl border border-border bg-card space-y-4 shadow-sm text-xs">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
            <Terminal className="w-4 h-4 text-primary" />
            cURL Code Examples
          </h3>

          <div className="space-y-3">
            <div>
              <p className="font-semibold text-foreground mb-1">List Practice Bookings:</p>
              <pre className="p-3 bg-slate-950 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
{`curl -X GET "https://api.theraflow.app/api/bookings" \\
  -H "Authorization: Bearer tf_live_948a..."`}
              </pre>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1">Synthesize Clinical SOAP Note:</p>
              <pre className="p-3 bg-slate-950 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
{`curl -X POST "https://api.theraflow.app/api/clinical/ai-scribe" \\
  -H "Authorization: Bearer tf_live_948a..." \\
  -H "Content-Type: application/json" \\
  -d '{"clientName": "Elena Rodriguez", "rawText": "Client reports reduced panic attacks...", "noteType": "SOAP"}'`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
