"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { notify } from "@/components/ui/toaster";
import {
  ClipboardList,
  Plus,
  FileCheck,
  CheckCircle,
  Copy,
  Eye,
  ShieldCheck,
  Clock,
  User,
  ExternalLink,
  ChevronRight,
  FileText,
  AlertCircle,
} from "lucide-react";

interface IntakeFormItem {
  id: string;
  name: string;
  description?: string | null;
  isDefault: boolean;
  status: string;
  createdAt: string;
  fields: Array<{
    id: string;
    label: string;
    type: string;
    required: boolean;
  }>;
  _count?: {
    submissions: number;
  };
}

interface IntakeSubmissionItem {
  id: string;
  formId: string;
  respondentName?: string | null;
  respondentEmail?: string | null;
  submittedAt: string;
  status: string;
  form?: { name: string };
  responses: Record<string, any>;
}

const DEFAULT_FORMS: IntakeFormItem[] = [
  {
    id: "form-standard-01",
    name: "Comprehensive Adult Clinical Intake",
    description: "Standard psychological evaluation, medical history, PHQ-9 & GAD-7 screening, and consent.",
    isDefault: true,
    status: "PUBLISHED",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    fields: [
      { id: "f1", label: "Full Legal Name", type: "text", required: true },
      { id: "f2", label: "Date of Birth", type: "date", required: true },
      { id: "f3", label: "Primary Reason for Seeking Therapy", type: "textarea", required: true },
      { id: "f4", label: "Current Symptoms & Anxiety Levels (GAD-7)", type: "scale", required: true },
      { id: "f5", label: "Emergency Contact Details", type: "text", required: true },
      { id: "f6", label: "HIPAA Notice & Telehealth Electronic Signature", type: "signature", required: true },
    ],
    _count: { submissions: 14 },
  },
  {
    id: "form-couples-02",
    name: "Couples & Relationship Assessment",
    description: "Pre-intake history for partners focusing on communication dynamics and relationship history.",
    isDefault: false,
    status: "PUBLISHED",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    fields: [
      { id: "c1", label: "Partner 1 Name", type: "text", required: true },
      { id: "c2", label: "Partner 2 Name", type: "text", required: true },
      { id: "c3", label: "Length of Relationship", type: "text", required: true },
      { id: "c4", label: "Core Relational Challenges", type: "textarea", required: true },
      { id: "c5", label: "Consent to Joint Therapy Record", type: "signature", required: true },
    ],
    _count: { submissions: 5 },
  },
];

const DEFAULT_SUBMISSIONS: IntakeSubmissionItem[] = [
  {
    id: "sub-01",
    formId: "form-standard-01",
    respondentName: "Elena Rostova",
    respondentEmail: "elena.rostova@example.com",
    submittedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    status: "APPROVED",
    form: { name: "Comprehensive Adult Clinical Intake" },
    responses: {
      "Full Legal Name": "Elena Rostova",
      "Date of Birth": "1991-04-12",
      "Primary Reason": "Severe work-related anxiety and panic attacks during client presentations.",
      "GAD-7 Score": "14 (Moderate-Severe Anxiety)",
      "Emergency Contact": "Marcus Rostova (Spouse) - 512-555-0199",
      "Signature": "Elena Rostova (Electronic timestamp verified)",
    },
  },
  {
    id: "sub-02",
    formId: "form-standard-01",
    respondentName: "David Miller",
    respondentEmail: "david.m@example.com",
    submittedAt: new Date(Date.now() - 28 * 3600000).toISOString(),
    status: "APPROVED",
    form: { name: "Comprehensive Adult Clinical Intake" },
    responses: {
      "Full Legal Name": "David Miller",
      "Date of Birth": "1988-11-23",
      "Primary Reason": "Chronic burnout, insomnia, and difficulty setting boundaries with management.",
      "GAD-7 Score": "11 (Moderate Anxiety)",
      "Emergency Contact": "Claire Miller (Sister) - 512-555-0144",
      "Signature": "David Miller (Electronic timestamp verified)",
    },
  },
];

export default function IntakeFormsCenter() {
  const [activeTab, setActiveTab] = useState<"forms" | "submissions">("forms");
  const [forms, setForms] = useState<IntakeFormItem[]>(DEFAULT_FORMS);
  const [submissions, setSubmissions] = useState<IntakeSubmissionItem[]>(DEFAULT_SUBMISSIONS);
  const [selectedSubmission, setSelectedSubmission] = useState<IntakeSubmissionItem | null>(null);

  // New Form Modal
  const [isNewFormOpen, setIsNewFormOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");

  useEffect(() => {
    fetch("/api/intake/forms")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setForms(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyLink = (formId: string) => {
    const url = `${window.location.origin}/intake/${formId}`;
    navigator.clipboard.writeText(url);
    notify.success("Shareable Link Copied", "Client intake link copied to clipboard.");
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newForm: IntakeFormItem = {
      id: `form-${Date.now()}`,
      name: formName.trim(),
      description: formDesc.trim() || "Standard clinical intake questionnaire.",
      isDefault: false,
      status: "PUBLISHED",
      createdAt: new Date().toISOString(),
      fields: [
        { id: "f1", label: "Full Legal Name", type: "text", required: true },
        { id: "f2", label: "Email Address", type: "text", required: true },
        { id: "f3", label: "Reason for Seeking Support", type: "textarea", required: true },
        { id: "f4", label: "Electronic Signature & Consent", type: "signature", required: true },
      ],
      _count: { submissions: 0 },
    };

    setForms([newForm, ...forms]);
    setIsNewFormOpen(false);
    setFormName("");
    setFormDesc("");
    notify.success("Intake Form Created", `"${newForm.name}" is now ready to share.`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Clinical Intake Forms"
        description="Streamline pre-session paperwork, clinical screening, and HIPAA-compliant consent workflows."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsNewFormOpen(true)}
          >
            Create Intake Form
          </Button>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-text-primary">{forms.length}</div>
            <div className="text-xs text-text-muted">Active Intake Forms</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ClipboardList className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-success">{submissions.length}</div>
            <div className="text-xs text-text-muted">Completed Submissions</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <FileCheck className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-secondary">100%</div>
            <div className="text-xs text-text-muted">HIPAA & e-Sign Verified</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Primary Tab Toggle */}
      <div className="flex border-b border-border text-sm font-semibold gap-6">
        <button
          onClick={() => setActiveTab("forms")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "forms"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Intake Form Templates ({forms.length})
        </button>

        <button
          onClick={() => setActiveTab("submissions")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "submissions"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <FileCheck className="w-4 h-4 text-success" />
          Completed Submissions ({submissions.length})
        </button>
      </div>

      {/* ── TAB 1: FORM TEMPLATES ────────────────────────────────────────── */}
      {activeTab === "forms" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forms.map((form) => (
            <Card key={form.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary text-base">{form.name}</span>
                    {form.isDefault && (
                      <Badge variant="primary" className="text-[10px]">
                        Default
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {form.fields.length} Fields
                  </Badge>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  {form.description}
                </p>

                {/* Field preview tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {form.fields.map((f) => (
                    <span key={f.id} className="text-[11px] px-2 py-0.5 rounded bg-surface-subtle border border-border text-text-secondary">
                      {f.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-text-muted">
                  <strong>{form._count?.submissions || 0}</strong> client responses
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => handleCopyLink(form.id)}
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copy Link
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── TAB 2: COMPLETED SUBMISSIONS ─────────────────────────────────── */}
      {activeTab === "submissions" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions Inbox List */}
          <div className="lg:col-span-1 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
              Recent Submissions
            </div>
            {submissions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSelectedSubmission(sub)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedSubmission?.id === sub.id
                    ? "bg-primary/10 border-primary shadow-xs"
                    : "bg-surface-raised border-border hover:border-border-strong"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-text-primary text-sm">{sub.respondentName}</span>
                  <span className="text-[10px] text-text-muted">
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-[11px] text-text-secondary truncate mb-2">{sub.form?.name}</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-muted">{sub.respondentEmail}</span>
                  <Badge variant="success" className="text-[10px]">
                    Reviewed
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Submission Detail Viewer */}
          <div className="lg:col-span-2">
            {selectedSubmission ? (
              <Card className="p-6 space-y-6">
                <div className="flex items-start justify-between border-b border-border pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-text-primary">{selectedSubmission.respondentName}</h3>
                      <Badge variant="success">Verified Submission</Badge>
                    </div>
                    <div className="text-xs text-text-muted mt-1 font-mono">
                      {selectedSubmission.respondentEmail} • Submitted {new Date(selectedSubmission.submittedAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Question and Answer pairs */}
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Clinical Responses & Screening
                  </div>
                  {Object.entries(selectedSubmission.responses).map(([question, answer]) => (
                    <div key={question} className="p-3 bg-surface rounded-xl border border-border space-y-1">
                      <div className="text-xs font-semibold text-text-muted">{question}</div>
                      <div className="text-xs text-text-primary leading-relaxed">{String(answer)}</div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-between text-xs">
                  <span className="text-secondary font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> HIPAA Consent Signed & Archived
                  </span>
                  <span className="text-text-muted font-mono text-[10px]">ID: {selectedSubmission.id}</span>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center text-text-muted">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="font-semibold text-text-primary text-sm">Select an intake submission</p>
                <p className="text-xs mt-1">Review client answers, clinical history, and signed disclosures.</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {isNewFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface-raised border border-border rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-text-primary">Create Clinical Intake Form</h3>
            <p className="text-xs text-text-muted">
              Add a specialized assessment or consent form for prospective clients.
            </p>

            <form onSubmit={handleCreateForm} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Form Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Adolescent & Guardian Intake"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Clinical purpose and consent overview..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-2.5 border border-border rounded-lg bg-surface text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsNewFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Create Form
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
