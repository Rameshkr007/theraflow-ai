"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { notify } from "@/components/ui/toaster";
import {
  FileText,
  Plus,
  ExternalLink,
  Edit3,
  Copy,
  Trash2,
  Search,
  Globe,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";

interface PracticePageItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  currentVersion: number;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

const DEFAULT_PAGES: PracticePageItem[] = [
  {
    id: "page-home-01",
    title: "Homepage",
    slug: "",
    type: "HOME",
    status: "PUBLISHED",
    currentVersion: 3,
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    seoTitle: "Willow & Mind Therapy | Austin, TX",
    seoDescription: "Compassionate, evidence-based therapy for anxiety, burnout, and couples in Austin, Texas.",
  },
  {
    id: "page-services-02",
    title: "Therapy Services",
    slug: "services",
    type: "SERVICES",
    status: "PUBLISHED",
    currentVersion: 2,
    updatedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    seoTitle: "Therapy Services & Modalities | Willow & Mind",
    seoDescription: "Explore specialized anxiety support, burnout counseling, and couples therapy.",
  },
  {
    id: "page-about-03",
    title: "About Dr. Sarah Willow",
    slug: "about",
    type: "ABOUT",
    status: "PUBLISHED",
    currentVersion: 2,
    updatedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    seoTitle: "About Dr. Sarah Willow | Licensed Therapist Austin",
    seoDescription: "Meet Dr. Sarah Willow, Psy.D., specializing in cognitive behavioral and somatic therapy.",
  },
  {
    id: "page-anxiety-04",
    title: "Anxiety & Panic Support",
    slug: "services/anxiety-support",
    type: "SERVICE_DETAIL",
    status: "PUBLISHED",
    currentVersion: 4,
    updatedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    seoTitle: "Anxiety Support in Austin, TX | Willow & Mind Therapy",
    seoDescription: "Targeted support for generalized anxiety, social anxiety, and panic symptoms.",
  },
  {
    id: "page-faq-05",
    title: "Fees & FAQs",
    slug: "faq",
    type: "FAQ",
    status: "DRAFT",
    currentVersion: 1,
    updatedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    seoTitle: "Therapy Fees, Superbills & FAQs | Willow & Mind",
    seoDescription: "Common questions about session fees, insurance reimbursement, and policies.",
  },
  {
    id: "page-contact-06",
    title: "Contact & Consultation",
    slug: "contact",
    type: "CONTACT",
    status: "PUBLISHED",
    currentVersion: 1,
    updatedAt: new Date(Date.now() - 96 * 3600000).toISOString(),
    seoTitle: "Contact Willow & Mind Therapy | Austin Office & Telehealth",
    seoDescription: "Reach out to schedule a free 15-minute phone consultation.",
  },
];

export default function WebsitePagesManager() {
  const router = useRouter();
  const [pages, setPages] = useState<PracticePageItem[]>(DEFAULT_PAGES);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("SERVICE_DETAIL");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Attempt fetching live pages from API
    fetch("/api/pages")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPages(data.data);
        }
      })
      .catch(() => {
        // Fall back gracefully to demo pages
      });
  }, []);

  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "ALL" || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          type: newType,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setPages((prev) => [json.data, ...prev]);
        notify.success("Page created", `"${newTitle}" draft created successfully.`);
        setIsCreateOpen(false);
        setNewTitle("");
        router.push(`/dashboard/website/builder?pageId=${json.data.id}`);
      } else {
        // Mock fallback if offline/demo
        const mockPage: PracticePageItem = {
          id: `page-${Date.now()}`,
          title: newTitle.trim(),
          slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          type: newType,
          status: "DRAFT",
          currentVersion: 1,
          updatedAt: new Date().toISOString(),
        };
        setPages((prev) => [mockPage, ...prev]);
        notify.success("Page draft created", "Draft added. Opening Smart Composer...");
        setIsCreateOpen(false);
        setNewTitle("");
        router.push(`/dashboard/website/builder?pageId=${mockPage.id}`);
      }
    } catch {
      notify.error("Creation failed", "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuplicate = (page: PracticePageItem) => {
    const copy: PracticePageItem = {
      ...page,
      id: `page-${Date.now()}`,
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy`,
      status: "DRAFT",
      currentVersion: 1,
      updatedAt: new Date().toISOString(),
    };
    setPages((prev) => [copy, ...prev]);
    notify.success("Page duplicated", `Draft created for "${copy.title}"`);
  };

  const handleArchive = (id: string, title: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    notify.info("Page archived", `"${title}" moved to archive.`);
  };

  const publishedCount = pages.filter((p) => p.status === "PUBLISHED").length;
  const draftCount = pages.filter((p) => p.status === "DRAFT").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Website Pages"
        description="Organize your practice's digital presence, preview live pages, and compose sections with AI."
        actions={
          <div className="flex items-center gap-3">
            <Link href="/dashboard/website/builder">
              <Button variant="secondary" leftIcon={<Sparkles className="w-4 h-4 text-secondary" />}>
                Open Smart Composer
              </Button>
            </Link>
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateOpen(true)}
            >
              Add Page
            </Button>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-text-primary">{pages.length}</div>
            <div className="text-xs text-text-muted">Total Practice Pages</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Layers className="w-5 h-5" />
          </div>
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-success">{publishedCount}</div>
            <div className="text-xs text-text-muted">Live & Published</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
            <Globe className="w-5 h-5" />
          </div>
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-warning">{draftCount}</div>
            <div className="text-xs text-text-muted">Unpublished Drafts</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
            <Edit3 className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search pages by title or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Filter pages by type"
              className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-secondary focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="HOME">Home</option>
              <option value="SERVICES">Services</option>
              <option value="SERVICE_DETAIL">Service Detail</option>
              <option value="ABOUT">About</option>
              <option value="FAQ">FAQ</option>
              <option value="CONTACT">Contact</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Pages Table */}
      <div className="bg-surface-raised border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-border">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-surface-subtle/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-subtle border border-border flex items-center justify-center shrink-0 text-text-secondary mt-1 md:mt-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary text-base">
                      {page.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {page.type}
                    </Badge>
                    <StatusBadge status={page.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted mt-1 font-mono">
                    <span>/{page.slug || ""}</span>
                    <span>•</span>
                    <span>v{page.currentVersion}</span>
                    <span>•</span>
                    <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <Link href={`/dashboard/website/builder?pageId=${page.id}`}>
                  <Button variant="outline" size="sm" leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
                    Composer
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  title="Duplicate Page"
                  onClick={() => handleDuplicate(page)}
                >
                  <Copy className="w-4 h-4 text-text-muted" />
                </Button>

                {page.type !== "HOME" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Archive Page"
                    onClick={() => handleArchive(page.id, page.title)}
                  >
                    <Trash2 className="w-4 h-4 text-error" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {filteredPages.length === 0 && (
            <div className="p-12 text-center text-text-muted">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-text-primary">No pages match your search</p>
              <p className="text-xs mt-1">Try adjusting your filters or create a new page.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Page Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface-raised border border-border rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-text-primary">Create New Practice Page</h3>
            <p className="text-xs text-text-muted">
              Add a specialized service page, clinical FAQ, or practice about page.
            </p>

            <form onSubmit={handleCreatePage} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Page Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Trauma-Informed EMDR Therapy"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1">
                  Page Template Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-sm focus:outline-none"
                >
                  <option value="SERVICE_DETAIL">Service Specialty Detail</option>
                  <option value="ABOUT">About / Clinical Team</option>
                  <option value="FAQ">FAQ & Insurance Information</option>
                  <option value="CONTACT">Contact & Booking Office</option>
                  <option value="CUSTOM">Custom Content Page</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={isSubmitting}
                >
                  Create & Launch Composer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
