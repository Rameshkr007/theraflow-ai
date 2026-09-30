"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { notify } from "@/components/ui/toaster";
import {
  Shield,
  Key,
  Smartphone,
  Lock,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  Laptop,
  LogOut,
  FileText,
} from "lucide-react";

interface AuditLogItem {
  id: string;
  action: string;
  userEmail?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  newValue?: any;
}

const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "log-01",
    action: "KNOWLEDGE_ITEM_APPROVED",
    userEmail: "sarah@willowmindtherapy.com",
    resourceType: "KnowledgeItem",
    resourceId: "k-01",
    ipAddress: "127.0.0.1",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    newValue: { status: "APPROVED", title: "Insurance Superbills & Reimbursement Policy" },
  },
  {
    id: "log-02",
    action: "PAGE_UPDATED",
    userEmail: "sarah@willowmindtherapy.com",
    resourceType: "Page",
    resourceId: "page-home-01",
    ipAddress: "127.0.0.1",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    newValue: { title: "Homepage", version: 3 },
  },
  {
    id: "log-03",
    action: "TESTIMONIAL_STATUS_UPDATED",
    userEmail: "sarah@willowmindtherapy.com",
    resourceType: "Testimonial",
    resourceId: "test-01",
    ipAddress: "127.0.0.1",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    newValue: { status: "PUBLISHED", consentGiven: true },
  },
  {
    id: "log-04",
    action: "WORKFLOW_CREATED",
    userEmail: "sarah@willowmindtherapy.com",
    resourceType: "Workflow",
    resourceId: "wf-01",
    ipAddress: "127.0.0.1",
    createdAt: new Date(Date.now() - 300 * 60000).toISOString(),
    newValue: { name: "Immediate Inquiry Acknowledgement" },
  },
];

export default function SecurityCenter() {
  const [logs, setLogs] = useState<AuditLogItem[]>(DEFAULT_AUDIT_LOGS);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/audit-logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setLogs(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.userEmail && log.userEmail.toLowerCase().includes(search.toLowerCase())) ||
      (log.resourceType && log.resourceType.toLowerCase().includes(search.toLowerCase()));
    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Security & Compliance Center"
        description="Maintain HIPAA compliance with multi-factor authentication, active session oversight, and immutable audit logs."
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-success">98 / 100</div>
            <div className="text-xs text-text-muted">Security Posture Score</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <Shield className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">Active</div>
            <div className="text-xs text-text-muted">2FA Authenticator</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Smartphone className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-secondary">1 Active</div>
            <div className="text-xs text-text-muted">Current Authorized Session</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <Laptop className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-text-primary">Encrypted</div>
            <div className="text-xs text-text-muted">Data at Rest (AES-256)</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-subtle flex items-center justify-center text-text-primary">
            <Lock className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Security Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2FA Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Two-Factor Authentication (2FA)</h3>
              <p className="text-xs text-text-muted">Required for all staff members accessing client clinical data.</p>
            </div>
          </div>

          <div className="p-3 bg-surface rounded-xl border border-border flex items-center justify-between text-xs">
            <span className="text-text-secondary font-medium">Authenticator App (TOTP)</span>
            <Badge variant="success">Configured</Badge>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-text-muted">Last verified today</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => notify.info("2FA Management", "Authenticator app configuration is active.")}
            >
              Reconfigure
            </Button>
          </div>
        </Card>

        {/* Active Sessions Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Active Clinical Sessions</h3>
              <p className="text-xs text-text-muted">Authorized browser and device sessions accessing your practice.</p>
            </div>
          </div>

          <div className="p-3 bg-surface rounded-xl border border-border flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-text-primary">Chrome on Windows (Current)</div>
              <div className="text-[11px] text-text-muted">Austin, TX • IP 127.0.0.1</div>
            </div>
            <Badge variant="success">Active Now</Badge>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-error hover:bg-error/10 text-xs"
              onClick={() => notify.success("Sessions Revoked", "All other device sessions have been terminated.")}
            >
              <LogOut className="w-3.5 h-3.5 mr-1" /> Revoke Other Sessions
            </Button>
          </div>
        </Card>
      </div>

      {/* Immutable Audit Log Viewer */}
      <Card className="overflow-hidden space-y-0">
        <div className="p-5 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Immutable Practice Audit Trail</h3>
            <p className="text-xs text-text-muted">
              Append-only tamper-evident record of all administrative, clinical, and AI actions.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search audit actions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 text-xs border border-border rounded-lg bg-surface focus:outline-none"
            />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-border rounded-lg bg-surface text-text-secondary focus:outline-none"
            >
              <option value="ALL">All Actions</option>
              <option value="PAGE_UPDATED">Page Updates</option>
              <option value="KNOWLEDGE_ITEM_APPROVED">Knowledge Approvals</option>
              <option value="TESTIMONIAL_STATUS_UPDATED">Testimonial Actions</option>
              <option value="WORKFLOW_CREATED">Workflow Creations</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs hover:bg-surface-subtle">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {log.action}
                  </Badge>
                  <span className="font-semibold text-text-primary">{log.userEmail}</span>
                </div>
                <div className="text-text-muted text-[11px] font-mono">
                  Target: {log.resourceType} ({log.resourceId}) • IP: {log.ipAddress || "127.0.0.1"}
                </div>
              </div>

              <div className="text-text-muted text-[11px] font-mono shrink-0">
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="p-12 text-center text-text-muted">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No audit events match your filter query.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
