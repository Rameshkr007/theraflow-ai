"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { notify } from "@/components/ui/toaster";
import {
  Users,
  Plus,
  Shield,
  Mail,
  UserCheck,
  Check,
  X,
  MoreVertical,
  Key,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "BILLING";
  title: string;
  status: "ACTIVE" | "INVITED";
  joinedAt: string;
}

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "mem-01",
    name: "Dr. Sarah Willow, Psy.D.",
    email: "sarah@willowmindtherapy.com",
    role: "OWNER",
    title: "Clinical Director & Founder",
    status: "ACTIVE",
    joinedAt: "2024-01-15",
  },
  {
    id: "mem-02",
    name: "Dr. Marcus Chen, Ph.D.",
    email: "marcus.chen@willowmindtherapy.com",
    role: "ADMIN",
    title: "Licensed Associate Psychologist",
    status: "ACTIVE",
    joinedAt: "2024-03-01",
  },
  {
    id: "mem-03",
    name: "Rachel Green, LPC",
    email: "rachel.g@willowmindtherapy.com",
    role: "MEMBER",
    title: "Staff Therapist (Couples Specialist)",
    status: "ACTIVE",
    joinedAt: "2024-06-12",
  },
  {
    id: "mem-04",
    name: "David Vance",
    email: "billing@willowmindtherapy.com",
    role: "BILLING",
    title: "Practice Billing & Superbill Coordinator",
    status: "ACTIVE",
    joinedAt: "2024-08-20",
  },
];

export default function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("MEMBER");
  const [inviteTitle, setInviteTitle] = useState("");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;

    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      title: inviteTitle.trim() || "Clinical Staff",
      status: "INVITED",
      joinedAt: new Date().toISOString().split("T")[0],
    };

    setMembers([...members, newMember]);
    setIsInviteOpen(false);
    setInviteName("");
    setInviteEmail("");
    setInviteTitle("");
    notify.success("Invitation Sent", `Invitation emailed to ${newMember.email}.`);
  };

  const getRoleBadge = (role: TeamMember["role"]) => {
    switch (role) {
      case "OWNER":
        return <Badge variant="primary">Practice Owner</Badge>;
      case "ADMIN":
        return <Badge variant="secondary">Admin Clinician</Badge>;
      case "BILLING":
        return <Badge variant="warning">Billing Specialist</Badge>;
      default:
        return <Badge variant="outline">Staff Member</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Team & Access Control"
        description="Manage clinicians, administrative staff, and HIPAA role-based access permissions."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsInviteOpen(true)}
          >
            Invite Team Member
          </Button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-text-primary">{members.length}</div>
            <div className="text-xs text-text-muted">Total Practice Staff</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Users className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-success">
              {members.filter((m) => m.role === "OWNER" || m.role === "ADMIN" || m.role === "MEMBER").length}
            </div>
            <div className="text-xs text-text-muted">Licensed Clinicians</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <UserCheck className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-secondary">Active</div>
            <div className="text-xs text-text-muted">HIPAA Access Audit Logging</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <Shield className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Members Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border font-bold text-xs uppercase tracking-wider text-text-secondary">
          Clinical Staff & Administrators
        </div>
        <div className="divide-y divide-border">
          {members.map((member) => (
            <div
              key={member.id}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-surface-subtle transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary text-sm">{member.name}</span>
                    {getRoleBadge(member.role)}
                    {member.status === "INVITED" && (
                      <Badge variant="outline" className="text-[10px]">
                        Pending Invite
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">{member.title}</div>
                  <div className="text-[11px] text-text-muted font-mono">{member.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-xs text-text-muted self-end sm:self-auto">
                <span>Joined {member.joinedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* RBAC Role Permissions Reference Matrix */}
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-text-primary mb-1">Role-Based Access Control (RBAC) Matrix</h3>
          <p className="text-xs text-text-muted">
            Enforces strict least-privilege security across patient data, clinical records, and billing settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
            <Badge variant="primary">OWNER</Badge>
            <div className="text-xs font-semibold text-text-primary">Practice Owner</div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Full administrative privileges, subscription billing, staff management, and clinical governance.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
            <Badge variant="secondary">ADMIN</Badge>
            <div className="text-xs font-semibold text-text-primary">Clinical Administrator</div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Manages website builder, approves AI facts, reviews clinical intakes, and configures automations.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
            <Badge variant="outline">MEMBER</Badge>
            <div className="text-xs font-semibold text-text-primary">Staff Clinician</div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Views assigned bookings, reviews client intake records, and manages personal calendar availability.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-surface space-y-2">
            <Badge variant="warning">BILLING</Badge>
            <div className="text-xs font-semibold text-text-primary">Billing Specialist</div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Restricted to Superbills, Stripe transaction receipts, and insurance claim codes. Zero patient clinical notes access.
            </p>
          </div>
        </div>
      </Card>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface-raised border border-border rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-text-primary">Invite Staff Member</h3>
            <p className="text-xs text-text-muted">
              Send an onboarding invitation with designated role permissions.
            </p>

            <form onSubmit={handleInvite} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Jane Doe"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="jane@willowmindtherapy.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Clinical Title</label>
                <input
                  type="text"
                  placeholder="e.g. Licensed Clinical Social Worker"
                  value={inviteTitle}
                  onChange={(e) => setInviteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Role Permissions</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs focus:outline-none"
                >
                  <option value="MEMBER">MEMBER (Staff Clinician)</option>
                  <option value="ADMIN">ADMIN (Clinical Administrator)</option>
                  <option value="BILLING">BILLING (Billing Specialist)</option>
                  <option value="OWNER">OWNER (Co-Owner)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
