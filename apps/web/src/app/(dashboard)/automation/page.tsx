"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { notify } from "@/components/ui/toaster";
import {
  Zap,
  Plus,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  ClipboardList,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Sliders,
} from "lucide-react";

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "PAUSED" | "DRAFT";
  trigger: {
    type: string;
    label: string;
  };
  actions: Array<{
    type: string;
    label: string;
  }>;
  runCount: number;
  lastRunAt: string | null;
  lastRunStatus: "SUCCESS" | "FAILED" | null;
}

const DEFAULT_WORKFLOWS: WorkflowItem[] = [
  {
    id: "wf-01",
    name: "Immediate Compassionate Inquiry Acknowledgement",
    description: "When a distressed client sends an inquiry, immediately send a warm reassurance email and alert clinical staff.",
    status: "ACTIVE",
    trigger: { type: "NEW_INQUIRY", label: "When new inquiry received" },
    actions: [
      { type: "SEND_EMAIL", label: "Send warm confirmation email to client" },
      { type: "NOTIFY_STAFF", label: "Send high-priority notification to Dr. Willow" },
    ],
    runCount: 42,
    lastRunAt: new Date(Date.now() - 3600000).toISOString(),
    lastRunStatus: "SUCCESS",
  },
  {
    id: "wf-02",
    name: "24-Hour Pre-Appointment SMS & Telehealth Link",
    description: "Send automated SMS with secure video portal link and 48-hour cancellation policy reminder.",
    status: "ACTIVE",
    trigger: { type: "APPOINTMENT_24H_BEFORE", label: "24 hours before scheduled session" },
    actions: [
      { type: "SEND_SMS", label: "Send SMS with private video room link" },
    ],
    runCount: 88,
    lastRunAt: new Date(Date.now() - 7200000).toISOString(),
    lastRunStatus: "SUCCESS",
  },
  {
    id: "wf-03",
    name: "Automated Clinical Intake Dispatch",
    description: "When an initial consultation is confirmed, automatically send the HIPAA clinical intake questionnaire.",
    status: "ACTIVE",
    trigger: { type: "BOOKING_CREATED", label: "When consultation confirmed" },
    actions: [
      { type: "SEND_INTAKE_LINK", label: "Email secure intake form link" },
    ],
    runCount: 29,
    lastRunAt: new Date(Date.now() - 14400000).toISOString(),
    lastRunStatus: "SUCCESS",
  },
  {
    id: "wf-04",
    name: "Post-First-Session Grounding & Reflection Check-in",
    description: "Send a gentle check-in note 3 hours after a client's first intake session with scheduling links.",
    status: "PAUSED",
    trigger: { type: "SESSION_COMPLETED", label: "3 hours after initial session" },
    actions: [
      { type: "SEND_EMAIL", label: "Send post-session grounding resources" },
    ],
    runCount: 16,
    lastRunAt: new Date(Date.now() - 86400000).toISOString(),
    lastRunStatus: "SUCCESS",
  },
];

export default function AutomationCenter() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(DEFAULT_WORKFLOWS);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newWfName, setNewWfName] = useState("");
  const [newWfDesc, setNewWfDesc] = useState("");
  const [newTriggerType, setNewTriggerType] = useState("NEW_INQUIRY");

  useEffect(() => {
    fetch("/api/automations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setWorkflows(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: nextStatus as any } : w))
    );
    notify.success(
      nextStatus === "ACTIVE" ? "Automation Activated" : "Automation Paused",
      `Workflow is now ${nextStatus.toLowerCase()}.`
    );
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWfName.trim()) return;

    const newWf: WorkflowItem = {
      id: `wf-${Date.now()}`,
      name: newWfName.trim(),
      description: newWfDesc.trim() || "Automated practice workflow.",
      status: "ACTIVE",
      trigger: {
        type: newTriggerType,
        label: `Trigger: ${newTriggerType.replace(/_/g, " ")}`,
      },
      actions: [{ type: "SEND_EMAIL", label: "Send automated email notification" }],
      runCount: 0,
      lastRunAt: null,
      lastRunStatus: null,
    };

    setWorkflows([newWf, ...workflows]);
    setIsNewOpen(false);
    setNewWfName("");
    setNewWfDesc("");
    notify.success("Automation Created", `"${newWf.name}" is now active.`);
  };

  const activeCount = workflows.filter((w) => w.status === "ACTIVE").length;
  const totalRuns = workflows.reduce((acc, w) => acc + (w.runCount || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Automation Center"
        description="Streamline clinical follow-ups, appointment reminders, and inquiry responsiveness with ethical automation."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4 text-white" />}
            onClick={() => setIsNewOpen(true)}
          >
            Create Automation
          </Button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-success">{activeCount}</div>
            <div className="text-xs text-text-muted">Active Workflows</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <Zap className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">{totalRuns}</div>
            <div className="text-xs text-text-muted">Automated Executions</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-text-primary">99.8%</div>
            <div className="text-xs text-text-muted">Delivery Success Rate</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <CheckCircle className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-warning">~18.5 hrs</div>
            <div className="text-xs text-text-muted">Admin Time Saved / mo</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
            <Clock className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
          Practice Automation Recipes
        </div>

        <div className="space-y-3">
          {workflows.map((wf) => (
            <Card
              key={wf.id}
              className={`p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                wf.status === "ACTIVE" ? "border-primary/20 bg-surface-raised" : "border-border bg-surface opacity-75"
              }`}
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-primary text-base">{wf.name}</span>
                  <Badge variant={wf.status === "ACTIVE" ? "success" : "outline"} className="text-[10px]">
                    {wf.status}
                  </Badge>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">{wf.description}</p>

                {/* Visual Trigger -> Action flow representation */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {wf.trigger.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                  {wf.actions.map((act, i) => (
                    <span key={i} className="bg-surface-subtle border border-border text-text-secondary px-2.5 py-1 rounded-md">
                      {act.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Execution statistics & toggle */}
              <div className="flex items-center gap-4 shrink-0 self-end md:self-auto border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right text-[11px] text-text-muted font-mono">
                  <div><strong>{wf.runCount}</strong> runs</div>
                  {wf.lastRunAt && (
                    <div className="text-[10px] text-success">
                      ✓ {new Date(wf.lastRunAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <Button
                  variant={wf.status === "ACTIVE" ? "outline" : "primary"}
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => handleToggleStatus(wf.id, wf.status)}
                >
                  {wf.status === "ACTIVE" ? (
                    <>
                      <Pause className="w-3 h-3 mr-1 text-warning" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 mr-1" /> Activate
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Automation Modal */}
      {isNewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface-raised border border-border rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-text-primary">Create Practice Automation</h3>
            <p className="text-xs text-text-muted">
              Configure a trigger and automated clinical action.
            </p>

            <form onSubmit={handleCreateWorkflow} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Automation Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Telehealth Room Dispatcher"
                  value={newWfName}
                  onChange={(e) => setNewWfName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Trigger Event</label>
                <select
                  value={newTriggerType}
                  onChange={(e) => setNewTriggerType(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs focus:outline-none"
                >
                  <option value="NEW_INQUIRY">When new inquiry is submitted</option>
                  <option value="BOOKING_CREATED">When appointment is confirmed</option>
                  <option value="APPOINTMENT_24H_BEFORE">24 hours before appointment</option>
                  <option value="INTAKE_SUBMITTED">When client completes intake form</option>
                  <option value="SESSION_COMPLETED">When session concludes</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="What does this workflow accomplish?"
                  value={newWfDesc}
                  onChange={(e) => setNewWfDesc(e.target.value)}
                  className="w-full p-2.5 border border-border rounded-lg bg-surface text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsNewOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Activate Recipe
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
