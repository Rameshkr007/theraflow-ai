"use client";

import React, { useState, useEffect } from "react";
import {
  AlertOctagon,
  ShieldAlert,
  PhoneCall,
  CheckCircle2,
  Clock,
  Sparkles,
  LifeBuoy,
  Send,
  Loader2,
  FileCheck,
  User,
} from "lucide-react";
import { notify } from "@/components/ui/toast";

interface CrisisAlert {
  id: string;
  source: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "IMMINENT";
  clientName?: string | null;
  clientContact?: string | null;
  contentSnippet: string;
  detectedKeywords: string[];
  riskScore: number;
  isResolved: boolean;
  resolvedAt?: string | null;
  actionTaken?: string | null;
  createdAt: string;
}

export default function CrisisPage() {
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Live Simulator state
  const [testText, setTestText] = useState("");
  const [simResult, setSimResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/crisis/alerts");
      const json = await res.json();
      if (json.success && json.data) {
        setAlerts(json.data);
      }
    } catch {
      notify.error("Failed to load crisis alerts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleSimulate = async () => {
    if (!testText.trim()) return;
    setIsSimulating(true);

    try {
      const res = await fetch("/api/crisis/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: testText,
          source: "CHAT",
          clientName: "Simulation Patient",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSimResult(json.data);
        if (json.data.isCrisis) {
          notify.error(`🚨 EMERGENCY CRISIS DETECTED (${json.data.severity})! 988 Lifeline Activated.`);
          fetchAlerts();
        } else {
          notify.success("Evaluation complete: No crisis keywords identified.");
        }
      }
    } catch {
      notify.error("Simulation failed");
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResolve = async (id: string) => {
    const actionTaken = prompt(
      "Enter clinical action taken (e.g. Followed safety contract, contacted emergency contact, referred to 988):",
      "Followed practice safety plan and confirmed client is in safe custody."
    );
    if (!actionTaken) return;

    try {
      const res = await fetch("/api/crisis/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, actionTaken }),
      });
      const json = await res.json();
      if (json.success) {
        notify.success("Crisis alert marked resolved with audit stamp");
        fetchAlerts();
      }
    } catch {
      notify.error("Failed to resolve alert");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              24/7 Crisis Safety Guardian & 988 Triaging
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5" /> High Risk Safety Protocol
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time heuristic evaluation on all intake submissions, contact forms, and client portal messages to safeguard human life.
          </p>
        </div>
      </div>

      {/* 988 Lifeline Emergency Banner */}
      <div className="p-5 rounded-xl border border-red-200 bg-red-50/60 dark:bg-red-950/20 text-red-900 dark:text-red-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-red-100 dark:bg-red-900/50 rounded-lg text-red-700 dark:text-red-300">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base">988 Suicide & Crisis Lifeline Active</h3>
            <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
              Dial or Text <strong>988</strong> · Free, confidential, 24/7 mental health crisis support across the US and Canada.
            </p>
            <p className="text-[11px] text-red-600/80 dark:text-red-400 mt-1">
              Automated popups trigger instantly whenever suicidal ideation or imminent self-harm language is submitted.
            </p>
          </div>
        </div>
        <a
          href="https://988lifeline.org"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors whitespace-nowrap shadow-sm"
        >
          View National 988 Protocol
        </a>
      </div>

      {/* Grid: Simulator & Triage Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulator */}
        <div className="lg:col-span-6 p-5 rounded-xl border border-border bg-card space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Interactive Crisis Heuristic Scanner
            </h3>
            <span className="text-[11px] text-muted-foreground">Test Live Detection</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Type a sample client message below to test real-time crisis severity detection and 988 emergency escalation:
          </p>

          <textarea
            rows={3}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Type e.g. 'I feel so hopeless and I want to end my life' or 'Having panic attacks daily'..."
            className="w-full p-2.5 text-xs bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setTestText("I feel completely hopeless and don't see any reason to live anymore.")}
              className="px-2.5 py-1 text-[11px] bg-muted border border-border rounded hover:bg-muted/80 text-muted-foreground"
            >
              Insert Suicidal Ideation Sample
            </button>
            <button
              onClick={() => setTestText("I am feeling stressed about my new job and want to work on time management.")}
              className="px-2.5 py-1 text-[11px] bg-muted border border-border rounded hover:bg-muted/80 text-muted-foreground"
            >
              Insert Normal Anxiety Sample
            </button>
          </div>

          <button
            onClick={handleSimulate}
            disabled={isSimulating || !testText.trim()}
            className="w-full py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-md hover:bg-primary/90 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Evaluate Text with Crisis Guard
          </button>

          {simResult && (
            <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${
              simResult.isCrisis ? "bg-red-50 border-red-200 text-red-900" : "bg-emerald-50 border-emerald-200 text-emerald-900"
            }`}>
              <div className="font-bold flex items-center justify-between">
                <span>{simResult.isCrisis ? "🚨 CRISIS DETECTED" : "✓ CLINICALLY STABLE"}</span>
                <span>Severity: {simResult.severity}</span>
              </div>
              {simResult.detectedKeywords.length > 0 && (
                <p className="text-[11px]">
                  <strong>Trigger Keywords:</strong> {simResult.detectedKeywords.join(", ")}
                </p>
              )}
              {simResult.isCrisis && (
                <p className="text-[11px] font-semibold text-red-700">
                  Action: Emergency 988 banner served to visitor + CrisisAlert logged for clinician.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Practice Emergency Protocol SOP */}
        <div className="lg:col-span-6 p-5 rounded-xl border border-border bg-card space-y-3 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-primary" />
            Standard Operating Procedures (SOP)
          </h3>
          <div className="space-y-2.5 text-xs text-muted-foreground">
            <div className="p-2.5 bg-muted/40 rounded border border-border">
              <strong className="text-foreground">Level 1: Imminent Risk (Active Ideation / Intent)</strong>
              <p className="mt-0.5 text-[11px]">
                Direct visitor to 988 via instant full-screen modal. Immediately alert primary clinician via urgent SMS and email.
              </p>
            </div>
            <div className="p-2.5 bg-muted/40 rounded border border-border">
              <strong className="text-foreground">Level 2: Moderate Risk (Passive Ideation / Severe Distress)</strong>
              <p className="mt-0.5 text-[11px]">
                Present 988 badge and crisis text line (741741). Flag client file for mandatory Safety Contract review in first 10 minutes of session.
              </p>
            </div>
            <div className="p-2.5 bg-muted/40 rounded border border-border">
              <strong className="text-foreground">Level 3: Clinician Resolution & Sign-Off</strong>
              <p className="mt-0.5 text-[11px]">
                All triggered alerts require clinician review and documented action taken before archiving to maintain licensure compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Practice Crisis Triage Log ({alerts.length})
        </h3>

        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Keywords Detected</th>
                <th className="py-3 px-4">Resolution</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : alerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No crisis alerts recorded. Practice is running safely.
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleDateString()} {new Date(alert.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-muted-foreground">
                      {alert.source}
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {alert.clientName || "Anonymous"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        alert.severity === "IMMINENT"
                          ? "bg-red-100 text-red-700 border border-red-300"
                          : alert.severity === "MODERATE"
                          ? "bg-amber-100 text-amber-700 border border-amber-300"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-muted-foreground">
                      {alert.detectedKeywords.join(", ")}
                    </td>
                    <td className="py-3 px-4">
                      {alert.isResolved ? (
                        <span className="text-emerald-600 font-medium inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Open Alert
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!alert.isResolved && (
                        <button
                          onClick={() => handleResolve(alert.id)}
                          className="px-2.5 py-1 bg-primary text-primary-foreground rounded text-[11px] font-semibold hover:bg-primary/90 shadow-sm"
                        >
                          Resolve & Stamp
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
