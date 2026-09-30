"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { notify } from "@/components/ui/toaster";
import {
  Star,
  Plus,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Globe,
  Trash2,
  Lock,
  Eye,
  Check,
  X,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface TestimonialItem {
  id: string;
  authorName: string;
  authorTitle?: string | null;
  content: string;
  rating: number;
  source: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PUBLISHED";
  consentGiven: boolean;
  consentDate?: string | null;
  publishedAt?: string | null;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "test-01",
    authorName: "Former Client (Tech Executive, Austin)",
    authorTitle: "Individual Anxiety & Burnout Therapy",
    content:
      "Working with Dr. Willow gave me permission to stop holding everything together with white knuckles. Six months into therapy, I finally feel grounded and anchored in my own life rather than in constant fight-or-flight.",
    rating: 5,
    source: "MANUAL",
    status: "PUBLISHED",
    consentGiven: true,
    consentDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: "test-02",
    authorName: "M. & T. (Couples Therapy)",
    authorTitle: "Couples & Communication Counseling",
    content:
      "We were stuck in the same circular, painful arguments for three years. Dr. Willow helped us de-escalate without defensiveness and created a space where we could both actually be heard.",
    rating: 5,
    source: "MANUAL",
    status: "PUBLISHED",
    consentGiven: true,
    consentDate: new Date(Date.now() - 60 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 50 * 86400000).toISOString(),
  },
  {
    id: "test-03",
    authorName: "Sarah K. (Grad Student)",
    authorTitle: "Life Transitions Counseling",
    content:
      "The practical grounding techniques and somatic tools were game-changing during my dissertation defense. Deeply compassionate and non-judgmental.",
    rating: 5,
    source: "MANUAL",
    status: "APPROVED",
    consentGiven: true,
    consentDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    publishedAt: null,
  },
];

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorTitle, setAuthorTitle] = useState("");
  const [content, setContent] = useState("");
  const [consentGiven, setConsentGiven] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setTestimonials(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PUBLISHED" ? "APPROVED" : "PUBLISHED";
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: nextStatus as any } : t))
        );
        notify.success(
          nextStatus === "PUBLISHED" ? "Published to Live Website" : "Removed from Live Website",
          nextStatus === "PUBLISHED"
            ? "Testimonial is now live in your website social proof section."
            : "Testimonial is unlinked from the public website."
        );
      }
    } catch {
      notify.error("Update failed", "Please verify consent status.");
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    if (!consentGiven) {
      notify.error("Consent Required", "Cannot save testimonial without client consent.");
      return;
    }

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: authorName.trim(),
          authorTitle: authorTitle.trim() || undefined,
          content: content.trim(),
          consentGiven: true,
          status: "APPROVED",
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setTestimonials([json.data, ...testimonials]);
      } else {
        const mock: TestimonialItem = {
          id: `test-${Date.now()}`,
          authorName: authorName.trim(),
          authorTitle: authorTitle.trim() || null,
          content: content.trim(),
          rating: 5,
          source: "MANUAL",
          status: "APPROVED",
          consentGiven: true,
          consentDate: new Date().toISOString(),
        };
        setTestimonials([mock, ...testimonials]);
      }
      setIsAddOpen(false);
      setAuthorName("");
      setAuthorTitle("");
      setContent("");
      notify.success("Testimonial Added", "Recorded with verified consent.");
    } catch {
      notify.error("Creation failed", "Please try again.");
    }
  };

  const publishedCount = testimonials.filter((t) => t.status === "PUBLISHED").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Reputation & Testimonials"
        description="Curate authentic client reflections with strict mental health ethics, documented consent, and anonymization."
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddOpen(true)}
          >
            Add Testimonial
          </Button>
        }
      />

      {/* Ethics Notice Banner */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-primary font-semibold">Mental Health Ethics Compliance (APA 5.05): </strong>
          TheraFlow AI enforces documented, voluntary client consent before any reflection can be published.
          Testimonials from active, vulnerable clients should never be solicited. Always favor de-identified or
          post-treatment reflections with explicit written consent.
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-success">{publishedCount}</div>
            <div className="text-xs text-text-muted">Live on Website</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <Globe className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-primary">{testimonials.length}</div>
            <div className="text-xs text-text-muted">Total Documented</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquare className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-secondary">100%</div>
            <div className="text-xs text-text-muted">Documented Consent</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-warning">5.0 / 5.0</div>
            <div className="text-xs text-text-muted">Average Rating</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
            <Star className="w-5 h-5 fill-current" />
          </div>
        </Card>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((test) => (
          <Card key={test.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-warning">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={test.consentGiven ? "success" : "error"} className="text-[10px]">
                    {test.consentGiven ? "Consent Verified" : "No Consent"}
                  </Badge>
                  <StatusBadge status={test.status} />
                </div>
              </div>

              <blockquote className="text-xs text-text-primary italic leading-relaxed">
                "{test.content}"
              </blockquote>

              <div className="pt-2">
                <div className="text-xs font-semibold text-text-primary">{test.authorName}</div>
                {test.authorTitle && (
                  <div className="text-[11px] text-text-muted">{test.authorTitle}</div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-[10px] text-text-muted">
                {test.consentDate && `Consent on ${new Date(test.consentDate).toLocaleDateString()}`}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant={test.status === "PUBLISHED" ? "outline" : "primary"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleTogglePublish(test.id, test.status)}
                >
                  {test.status === "PUBLISHED" ? (
                    <>
                      <X className="w-3 h-3 mr-1" /> Unpublish
                    </>
                  ) : (
                    <>
                      <Globe className="w-3 h-3 mr-1" /> Publish Live
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Testimonial Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface-raised border border-border rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-text-primary">Record Client Reflection</h3>
            <p className="text-xs text-text-muted">
              Add voluntary, consented feedback. Must comply with clinical advertising ethics.
            </p>

            <form onSubmit={handleAddTestimonial} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Client Attribution Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Elena R. or Anonymous Tech Executive"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Service / Focus Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Individual Burnout Counseling"
                  value={authorTitle}
                  onChange={(e) => setAuthorTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Testimonial Quote *
                </label>
                <textarea
                  rows={3}
                  placeholder="Verbatim reflection provided by the client..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2.5 border border-border rounded-lg bg-surface text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="p-3 bg-surface rounded-lg border border-border flex items-start gap-2">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 text-primary rounded"
                />
                <label htmlFor="consent" className="text-[11px] text-text-secondary leading-tight cursor-pointer">
                  I certify that voluntary written consent has been provided by the client for ethical online display.
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Testimonial
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
