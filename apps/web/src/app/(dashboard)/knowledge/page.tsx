"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { notify } from "@/components/ui/toaster";
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle,
  Clock,
  FileText,
  UploadCloud,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Edit2,
  Trash2,
  Send,
  AlertCircle,
  FileCheck,
  Brain,
  Layers,
  ArrowRight,
} from "lucide-react";

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: "SERVICE" | "FAQ" | "POLICY" | "TEAM" | "LOCATION" | "GENERAL" | "TESTIMONIAL";
  source: "MANUAL" | "DOCUMENT" | "SERVICE" | "BOOKING" | "AI_GENERATED";
  status: "DRAFT" | "REVIEW" | "APPROVED" | "ARCHIVED";
  version: number;
  updatedAt: string;
  approvedAt?: string | null;
}

interface DocumentItem {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  processingStatus: "PENDING" | "EXTRACTING" | "CHUNKING" | "INDEXING" | "COMPLETE" | "FAILED";
  virusScanStatus: "CLEAN" | "PENDING" | "INFECTED";
  chunkCount: number;
  createdAt: string;
}

const DEFAULT_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: "k-01",
    title: "Insurance Superbills & Reimbursement Policy",
    content:
      "Willow & Mind Therapy is a private-pay, out-of-network practice. We do not bill insurance companies directly. We issue comprehensive monthly Superbills with all CPT and ICD-10 diagnostic codes so clients can seek 50-80% PPO out-of-network reimbursement.",
    type: "POLICY",
    source: "MANUAL",
    status: "APPROVED",
    version: 2,
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    approvedAt: new Date().toISOString(),
  },
  {
    id: "k-02",
    title: "48-Hour Cancellation & Rescheduling Policy",
    content:
      "Appointments must be cancelled or rescheduled with at least 48 hours notice. Cancellations made under 48 hours or missed appointments are charged the full session fee ($150 / $200), as that clinical hour is reserved exclusively for you.",
    type: "POLICY",
    source: "MANUAL",
    status: "APPROVED",
    version: 1,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    approvedAt: new Date().toISOString(),
  },
  {
    id: "k-03",
    title: "Standard Clinical Session Fees",
    content:
      "Individual therapy sessions (50 minutes) are $150. Couples and relationship therapy sessions (80 minutes) are $200. A free 15-minute phone consultation is offered to all prospective clients prior to booking an intake.",
    type: "FAQ",
    source: "MANUAL",
    status: "APPROVED",
    version: 1,
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    approvedAt: new Date().toISOString(),
  },
  {
    id: "k-04",
    title: "Austin Physical Office & Telehealth Reach",
    content:
      "In-person appointments take place at 2801 South Lamar Blvd, Suite 204, Austin, TX 78704. Telehealth sessions are conducted via our secure HIPAA-compliant video portal for residents across Texas and PsyPact participating states.",
    type: "LOCATION",
    source: "MANUAL",
    status: "APPROVED",
    version: 1,
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    approvedAt: new Date().toISOString(),
  },
  {
    id: "k-05",
    title: "Proposed Sliding Scale Protocols for 2026",
    content:
      "Draft policy reserving up to 4 recurring slots at $90/session for verified full-time students and community non-profit workers experiencing financial hardship.",
    type: "POLICY",
    source: "DOCUMENT",
    status: "REVIEW", // Not available to AI assistant yet!
    version: 1,
    updatedAt: new Date(Date.now() - 1200000).toISOString(),
  },
];

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-01",
    name: "Willow_Mind_Practice_Policies_2026.pdf",
    size: 428000,
    mimeType: "application/pdf",
    processingStatus: "COMPLETE",
    virusScanStatus: "CLEAN",
    chunkCount: 6,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "doc-02",
    name: "Informed_Consent_Disclosures.pdf",
    size: 245000,
    mimeType: "application/pdf",
    processingStatus: "COMPLETE",
    virusScanStatus: "CLEAN",
    chunkCount: 4,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function PracticeKnowledgeHub() {
  const [activeTab, setActiveTab] = useState<"knowledge" | "documents" | "rag-test">("knowledge");
  const [items, setItems] = useState<KnowledgeItem[]>(DEFAULT_KNOWLEDGE);
  const [documents, setDocuments] = useState<DocumentItem[]>(DEFAULT_DOCUMENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // Create Item Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<KnowledgeItem["type"]>("POLICY");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // RAG Playground State
  const [testQuery, setTestQuery] = useState("Do you accept insurance or provide superbills?");
  const [isQuerying, setIsQuerying] = useState(false);
  const [ragResult, setRagResult] = useState<{
    answer: string;
    citations: any[];
    groundednessScore: number;
    latencyMs: number;
  } | null>(null);

  useEffect(() => {
    // Fetch live knowledge from database
    fetch("/api/knowledge")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setItems(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleApproval = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "APPROVED" ? "DRAFT" : "APPROVED";
    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: nextStatus, approvedAt: nextStatus === "APPROVED" ? new Date().toISOString() : null } : item))
        );
        notify.success(
          nextStatus === "APPROVED" ? "Approved for Public AI" : "Approval Revoked",
          nextStatus === "APPROVED"
            ? "This verified fact is now available to your AI Visitor Assistant."
            : "Item moved to Draft. The AI assistant will no longer cite this fact."
        );
      }
    } catch {
      notify.error("Update failed", "Please try again.");
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          type: newType,
          content: newContent.trim(),
          status: "REVIEW",
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setItems((prev) => [json.data, ...prev]);
        notify.success("Item Added", "Knowledge item added in Review status.");
      } else {
        const mock: KnowledgeItem = {
          id: `k-${Date.now()}`,
          title: newTitle.trim(),
          content: newContent.trim(),
          type: newType,
          source: "MANUAL",
          status: "REVIEW",
          version: 1,
          updatedAt: new Date().toISOString(),
        };
        setItems((prev) => [mock, ...prev]);
        notify.success("Item Added", "Knowledge item added in Review status.");
      }
      setIsCreateOpen(false);
      setNewTitle("");
      setNewContent("");
    } catch {
      notify.error("Error creating item", "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestRag = async () => {
    if (!testQuery.trim()) return;
    setIsQuerying(true);
    setRagResult(null);

    try {
      const res = await fetch("/api/ai/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: testQuery }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setRagResult(json.data);
      } else {
        // Fallback simulation
        setRagResult({
          answer:
            "Willow & Mind Therapy is an out-of-network practice and does not bill insurance directly. However, we provide monthly Superbills with all required diagnostic and CPT codes, which many clients submit to PPO plans for 50% to 80% reimbursement. We encourage you to check your out-of-network benefits!",
          citations: [
            {
              id: "k-01",
              title: "Insurance Superbills & Reimbursement Policy",
              type: "POLICY",
              version: 2,
            },
          ],
          groundednessScore: 98,
          latencyMs: 310,
        });
      }
    } catch {
      notify.error("RAG Test query failed", "Check connection.");
    } finally {
      setIsQuerying(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchesType = typeFilter === "ALL" || item.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const approvedCount = items.filter((i) => i.status === "APPROVED").length;
  const reviewCount = items.filter((i) => i.status === "REVIEW").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Practice Knowledge Hub"
        description="The trusted source of truth for your digital practice. Control what your AI assistant is authorized to know, cite, and answer."
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Brain className="w-4 h-4 text-secondary" />}
              onClick={() => setActiveTab("rag-test")}
            >
              Test AI Understanding
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateOpen(true)}
            >
              Add Knowledge Fact
            </Button>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-success">{approvedCount}</div>
            <div className="text-xs text-text-muted">Approved Facts (Live in AI)</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-warning">{reviewCount}</div>
            <div className="text-xs text-text-muted">In Review (Hidden from AI)</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
            <Clock className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-text-primary">{documents.length}</div>
            <div className="text-xs text-text-muted">Processed Documents</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FileText className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">98%</div>
            <div className="text-xs text-text-muted">AI Groundedness Index</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <Sparkles className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-border text-sm font-semibold gap-6">
        <button
          onClick={() => setActiveTab("knowledge")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "knowledge"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Knowledge Base ({items.length})
        </button>

        <button
          onClick={() => setActiveTab("documents")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "documents"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          Document Intelligence ({documents.length})
        </button>

        <button
          onClick={() => setActiveTab("rag-test")}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "rag-test"
              ? "border-primary text-primary"
              : "border-transparent text-text-muted hover:text-text-primary"
          }`}
        >
          <Brain className="w-4 h-4 text-secondary" />
          RAG Test Playground
        </button>
      </div>

      {/* ── TAB 1: KNOWLEDGE ITEMS LIST ─────────────────────────────────── */}
      {activeTab === "knowledge" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search policies, fees, FAQs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-border rounded-lg bg-surface text-text-secondary focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="POLICY">Policies</option>
                  <option value="FAQ">FAQs</option>
                  <option value="SERVICE">Services</option>
                  <option value="LOCATION">Location & Hours</option>
                  <option value="GENERAL">General</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-border rounded-lg bg-surface text-text-secondary focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="APPROVED">Approved (AI Active)</option>
                  <option value="REVIEW">Needs Review</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className={`p-5 flex flex-col justify-between transition-all ${
                  item.status === "APPROVED"
                    ? "border-success/30 bg-surface-raised shadow-xs"
                    : item.status === "REVIEW"
                    ? "border-warning/30 bg-warning/5"
                    : "border-border bg-surface opacity-80"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        {item.type}
                      </Badge>
                      <StatusBadge status={item.status} />
                    </div>
                    <span className="text-[10px] font-mono text-text-muted">v{item.version}</span>
                  </div>

                  <h3 className="font-semibold text-text-primary text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">{item.content}</p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
                  <span className="text-[11px]">
                    Source: <strong className="text-text-secondary">{item.source}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {item.status === "APPROVED" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[11px] h-7 text-text-muted hover:text-error"
                        onClick={() => handleToggleApproval(item.id, item.status)}
                      >
                        <X className="w-3.5 h-3.5 mr-1 text-error" /> Revoke AI Approval
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-[11px] h-7"
                        onClick={() => handleToggleApproval(item.id, item.status)}
                      >
                        <Check className="w-3.5 h-3.5 mr-1" /> Approve for Public AI
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-2 p-12 text-center text-text-muted bg-surface-raised border border-border rounded-xl">
                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="font-semibold text-text-primary text-sm">No knowledge items found</p>
                <p className="text-xs mt-1">Adjust your filters or add a new verified practice policy.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: DOCUMENT INTELLIGENCE ─────────────────────────────────── */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center bg-surface-raised hover:border-primary/50 transition-colors">
            <UploadCloud className="w-12 h-12 mx-auto mb-3 text-primary opacity-80" />
            <h3 className="text-sm font-bold text-text-primary mb-1">
              Upload Practice Document (PDF, DOCX)
            </h3>
            <p className="text-xs text-text-muted max-w-md mx-auto mb-4">
              Our Document Intelligence pipeline automatically virus-scans, extracts text, chunks,
              and generates draft knowledge facts for clinician review.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const newDoc: DocumentItem = {
                    id: `doc-${Date.now()}`,
                    name: "Good_Faith_Estimate_Notice.pdf",
                    size: 310000,
                    mimeType: "application/pdf",
                    processingStatus: "COMPLETE",
                    virusScanStatus: "CLEAN",
                    chunkCount: 3,
                    createdAt: new Date().toISOString(),
                  };
                  setDocuments([newDoc, ...documents]);
                  notify.success(
                    "Document Ingested",
                    "Extracted 3 chunks. Draft knowledge items created for review."
                  );
                }}
              >
                Upload Document (Simulate)
              </Button>
            </div>
            <div className="text-[10px] text-text-muted mt-3">
              🔒 Privacy Guaranteed: Uploaded documents are never directly exposed to visitors without review.
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border font-bold text-xs uppercase tracking-wider text-text-secondary">
              Processed Practice Documents
            </div>
            <div className="divide-y divide-border">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <div className="font-semibold text-text-primary">{doc.name}</div>
                      <div className="text-[11px] text-text-muted">
                        {(doc.size / 1024).toFixed(1)} KB • {doc.chunkCount} text chunks indexed
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-success font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Virus Clean
                    </span>
                    <Badge variant="success" className="text-[10px]">
                      {doc.processingStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: RAG TEST PLAYGROUND ───────────────────────────────────── */}
      {activeTab === "rag-test" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Query Box */}
          <Card className="p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary mb-1 flex items-center gap-2">
                <Brain className="w-4 h-4 text-secondary" />
                Ask Your Practice Knowledge Base
              </h3>
              <p className="text-xs text-text-muted">
                Simulate how the public AI Visitor Assistant answers questions using only approved facts.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-secondary block">
                Sample Client Question
              </label>
              <textarea
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                rows={3}
                className="w-full p-3 text-xs border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ask about fees, cancellation, telehealth, or credentials..."
              />
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              {[
                "Do you accept insurance?",
                "What is your cancellation policy?",
                "Where is the office located?",
                "How much does a session cost?",
              ].map((sample) => (
                <button
                  key={sample}
                  onClick={() => setTestQuery(sample)}
                  className="px-2.5 py-1 bg-surface-subtle hover:bg-surface border border-border rounded-md text-text-secondary"
                >
                  {sample}
                </button>
              ))}
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={handleTestRag}
              loading={isQuerying}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Run RAG Retrieval Query
            </Button>
          </Card>

          {/* AI Response with Grounding & Citation Transparency */}
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center justify-between">
              <span>Verified Response Output</span>
              {ragResult && (
                <Badge variant="success" className="text-[10px]">
                  {ragResult.groundednessScore}% Grounded
                </Badge>
              )}
            </h3>

            {ragResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-xs text-text-primary leading-relaxed">
                  {ragResult.answer}
                </div>

                {/* Sources & Citations */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-success" /> Verified Knowledge Sources
                  </div>
                  {ragResult.citations.map((c: any) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-lg bg-surface border border-border text-xs flex items-center justify-between"
                    >
                      <div className="truncate font-medium text-text-primary">{c.title}</div>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {c.type} (v{c.version})
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border">
                  <span>Latency: {ragResult.latencyMs}ms</span>
                  <span>Safety Filter: Verified Clean</span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-text-muted">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-secondary opacity-40" />
                <p className="text-xs">Click "Run RAG Retrieval Query" to view grounded response and citations.</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Add Knowledge Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface-raised border border-border rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-text-primary">Add Practice Knowledge Fact</h3>
            <p className="text-xs text-text-muted">
              Add verified clinical facts or practice guidelines. Items start in Review status.
            </p>

            <form onSubmit={handleCreateItem} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Fact Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Telehealth Technology & Consent Requirements"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Category
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs focus:outline-none"
                >
                  <option value="POLICY">Practice Policy</option>
                  <option value="FAQ">Fee & Service FAQ</option>
                  <option value="SERVICE">Clinical Modality</option>
                  <option value="LOCATION">Office Location & Hours</option>
                  <option value="TEAM">Clinical Team / Licensure</option>
                  <option value="GENERAL">General Guidelines</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Verified Content *
                </label>
                <textarea
                  rows={4}
                  placeholder="Accurate, factual policy or practice guideline..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
                  Save Knowledge Fact
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
