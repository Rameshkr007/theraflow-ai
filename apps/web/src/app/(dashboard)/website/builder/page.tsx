"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { notify } from "@/components/ui/toaster";
import {
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Palette,
  Undo2,
  Save,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Sliders,
  RotateCcw,
} from "lucide-react";

export interface PageSection {
  id: string;
  type: "hero" | "trust" | "services" | "about" | "testimonials" | "faq" | "location" | "pricing" | "cta";
  name: string;
  hidden: boolean;
  content: Record<string, any>;
}

const INITIAL_SECTIONS: PageSection[] = [
  {
    id: "sec-hero",
    type: "hero",
    name: "Hero Header",
    hidden: false,
    content: {
      tagline: "Licensed Clinical Psychologist • Austin, Texas",
      headline: "Find steady ground when life feels overwhelming.",
      subhead:
        "Compassionate, evidence-based therapy tailored for high-achievers navigating anxiety, perfectionism, and career burnout.",
      primaryCta: "Schedule a Free Consultation",
      secondaryCta: "Explore Specialties",
      tertiaryCta: "Read My Story", // AI Design Director will flag this!
    },
  },
  {
    id: "sec-trust",
    type: "trust",
    name: "Trust & Accreditations",
    hidden: false,
    content: {
      badgeText: "Licensed & Verified Practice",
      items: [
        "Texas State Board of Examiners of Psychologists (#38219)",
        "APA Member",
        "PsyPact Telehealth Authorized in 38+ States",
        "Gottman Level II Certified",
      ],
    },
  },
  {
    id: "sec-services",
    type: "services",
    name: "Clinical Services",
    hidden: false,
    content: {
      title: "Specialized Therapy for Meaningful Change",
      subtitle: "Every session is collaborative, deeply grounded, and paced to your emotional safety.",
      items: [
        {
          name: "Anxiety & Panic Support",
          description: "Unravel persistent worry, physical tension, and overthinking with CBT and somatic regulation.",
          duration: "50 min",
          fee: "$150",
        },
        {
          name: "Burnout & Perfectionism",
          description: "Break the cycle of chronic exhaustion, self-criticism, and people-pleasing in high-pressure roles.",
          duration: "50 min",
          fee: "$150",
        },
        {
          name: "Couples & Relationship Therapy",
          description: "Restore emotional safety, de-escalate circular arguments, and rebuild intimacy.",
          duration: "80 min",
          fee: "$200",
        },
      ],
    },
  },
  {
    id: "sec-about",
    type: "about",
    name: "Therapist Bio",
    hidden: false,
    content: {
      name: "Dr. Sarah Willow, Psy.D.",
      title: "Licensed Clinical Psychologist",
      bio: "I believe therapy should feel like taking a deep, unhurried breath. With over a decade of clinical experience in Austin, I help clients step off the hamster wheel of survival mode and cultivate authentic, sustainable peace.",
      credentials: "Doctorate in Clinical Psychology (Psy.D.) • University of Texas",
    },
  },
  {
    id: "sec-testimonials",
    type: "testimonials",
    name: "Client Reflections",
    hidden: false,
    content: {
      title: "What Working Together Feels Like",
      quote: "Working with Dr. Willow gave me permission to stop holding everything together with white knuckles. Six months into therapy, I finally feel anchored in my own life.",
      author: "Tech Executive & Mother",
      location: "Austin, TX (Client consent given for anonymous sharing)",
    },
  },
  {
    id: "sec-faq",
    type: "faq",
    name: "Frequently Asked Questions",
    hidden: false,
    content: {
      title: "Frequently Asked Questions",
      items: [
        {
          q: "Do you accept health insurance?",
          a: "Willow & Mind is an out-of-network practice. We provide comprehensive monthly Superbills with all medical coding necessary for 50-80% PPO reimbursement.",
        },
        {
          q: "What can I expect in our first consultation call?",
          a: "Our free 15-minute phone consultation is a relaxed, zero-pressure opportunity to discuss what you're experiencing and ensure we're an aligned clinical fit.",
        },
        {
          q: "Do you offer telehealth or in-person sessions?",
          a: "Both! We see clients in-person at our South Lamar office in Austin, and offer HIPAA-compliant video telehealth to clients across Texas and PsyPact states.",
        },
      ],
    },
  },
  {
    id: "sec-pricing",
    type: "pricing",
    name: "Fees & Investment",
    hidden: false,
    content: {
      title: "Transparent Practice Fees",
      individualRate: "$150 per 50-minute individual session",
      couplesRate: "$200 per 80-minute couples session",
      policyNote: "A limited number of sliding-scale slots are reserved for students and non-profit workers.",
    },
  },
  {
    id: "sec-cta",
    type: "cta",
    name: "Booking Call-to-Action",
    hidden: false,
    content: {
      headline: "You don't have to carry this alone.",
      subhead: "Take the first gentle step today. Book a free 15-minute consultation to see if we're the right fit.",
      buttonText: "Schedule Consultation",
    },
  },
];

export default function SmartPageComposer() {
  const [sections, setSections] = useState<PageSection[]>(INITIAL_SECTIONS);
  const [activeSectionId, setActiveSectionId] = useState<string>("sec-hero");
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [sidebarTab, setSidebarTab] = useState<"sections" | "design" | "ai" | "brand">("ai");
  const [isSaving, setIsSaving] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // AI Design Director state
  const [auditScore, setAuditScore] = useState(82);
  const [recommendations, setRecommendations] = useState<any[]>([
    {
      id: "rec-hero-cta",
      title: "Three competing CTAs in Hero section",
      problem: "Your hero contains 3 competing actions ('Schedule', 'Explore', 'Read My Story'). Clients in distress experience decision fatigue.",
      solution: "Reduce to one primary 'Schedule Consultation' action and a gentle secondary text link.",
      type: "CTA",
      severity: "high",
      applied: false,
    },
    {
      id: "rec-mobile-density",
      title: "Service fee transparency",
      problem: "Displaying fee ranges upfront builds immediate clinical trust and prevents abandoned booking attempts.",
      solution: "Ensure the Transparent Fees section is positioned before the final booking CTA.",
      type: "HIERARCHY",
      severity: "medium",
      applied: false,
    },
  ]);

  // AI Section Improver state
  const [selectedGoal, setSelectedGoal] = useState<string>("warmer");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [aiDiff, setAiDiff] = useState<{ before: any; after: any; explanation?: string } | null>(null);

  // Brand Token state
  const [brandTokens, setBrandTokens] = useState({
    primaryColor: "#2D6A4F",
    secondaryColor: "#7B6FA0",
    borderRadius: "rounded-xl",
    headingFont: "font-serif",
  });

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  // Section manipulation
  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    setSections(newSections);
    notify.info("Section moved", `Reordered ${temp.name}`);
  };

  const toggleHideSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, hidden: !s.hidden } : s))
    );
  };

  const duplicateSection = (section: PageSection) => {
    const copy: PageSection = {
      ...section,
      id: `sec-${Date.now()}`,
      name: `${section.name} (Copy)`,
    };
    setSections((prev) => [...prev, copy]);
    notify.success("Section duplicated", `Created ${copy.name}`);
  };

  const deleteSection = (id: string) => {
    if (sections.length <= 1) {
      notify.warning("Cannot delete", "Page must have at least one section.");
      return;
    }
    setSections((prev) => prev.filter((s) => s.id !== id));
    notify.info("Section removed", "Section removed from draft.");
  };

  // AI Design Director fix apply / undo
  const applyDesignFix = (recId: string) => {
    if (recId === "rec-hero-cta") {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id === "sec-hero") {
            return {
              ...s,
              content: {
                ...s.content,
                tertiaryCta: undefined, // remove competing action
              },
            };
          }
          return s;
        })
      );
      setRecommendations((prev) =>
        prev.map((r) => (r.id === recId ? { ...r, applied: true } : r))
      );
      setAuditScore(94);
      notify.success("Design recommendation applied", "Hero CTA simplified for higher conversion.");
    }
  };

  const undoDesignFix = (recId: string) => {
    if (recId === "rec-hero-cta") {
      setSections((prev) =>
        prev.map((s) => {
          if (s.id === "sec-hero") {
            return {
              ...s,
              content: {
                ...s.content,
                tertiaryCta: "Read My Story",
              },
            };
          }
          return s;
        })
      );
      setRecommendations((prev) =>
        prev.map((r) => (r.id === recId ? { ...r, applied: false } : r))
      );
      setAuditScore(82);
      notify.info("Design change reverted", "Restored original hero configuration.");
    }
  };

  // AI Section Regeneration call
  const handleRegenerateWithAi = async () => {
    if (!activeSection) return;
    setIsRegenerating(true);
    setAiDiff(null);

    try {
      const res = await fetch("/api/ai/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: activeSection.type,
          currentContent: activeSection.content,
          goal: selectedGoal,
          practiceContext: {
            name: "Willow & Mind Therapy",
            specialties: ["Anxiety Support", "Burnout Counseling", "Couples Therapy"],
          },
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAiDiff({
          before: activeSection.content,
          after: json.data.after,
          explanation: json.data.explanation,
        });
        notify.success("Improvement drafted", "Review the before/after preview below.");
      } else {
        // Fallback simulated improvement
        let improved = { ...activeSection.content };
        if (activeSection.type === "hero") {
          improved.headline = "A calm, grounded space to untangle anxiety and exhaustion.";
          improved.subhead =
            "Evidence-based individual and couples therapy in Austin. Begin with a confidential 15-minute consultation.";
        }
        setAiDiff({
          before: activeSection.content,
          after: improved,
          explanation: "Enhanced warmth, eliminated subtle clinical jargon, and highlighted psychological safety.",
        });
      }
    } catch {
      notify.error("AI Assistant busy", "Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const acceptAiDiff = () => {
    if (!aiDiff) return;
    setSections((prev) =>
      prev.map((s) => (s.id === activeSectionId ? { ...s, content: aiDiff.after } : s))
    );
    setAiDiff(null);
    notify.success("Section updated", "AI improvements accepted and applied to canvas.");
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      notify.success("Draft saved", "All page changes saved to version history (v3).");
    }, 600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-surface-subtle">
      {/* ── TOP COMPOSER TOOLBAR ────────────────────────────────────────── */}
      <div className="bg-surface-raised border-b border-border px-6 py-3 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/website/pages" className="text-xs text-text-muted hover:text-text-primary">
            ← Pages
          </Link>
          <span className="text-border">|</span>
          <h2 className="text-base font-bold text-text-primary">Homepage Composer</h2>
          <Badge variant="outline" className="text-xs">
            Draft v3
          </Badge>
          <span className="text-xs text-text-muted hidden sm:inline">
            • Auto-saved 2m ago
          </span>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center bg-surface-subtle rounded-lg p-1 border border-border">
          <button
            onClick={() => setDeviceView("desktop")}
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${
              deviceView === "desktop" ? "bg-surface-raised shadow-xs text-text-primary" : "text-text-muted"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDeviceView("tablet")}
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${
              deviceView === "tablet" ? "bg-surface-raised shadow-xs text-text-primary" : "text-text-muted"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDeviceView("mobile")}
            className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 ${
              deviceView === "mobile" ? "bg-surface-raised shadow-xs text-text-primary" : "text-text-muted"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSaveDraft} loading={isSaving}>
            <Save className="w-3.5 h-3.5 mr-1" />
            Save Draft
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              notify.success("Website Published", "Your changes are now live on your domain!");
            }}
          >
            Publish Live
          </Button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE (LEFT NAV + CANVAS + RIGHT AI PANEL) ──────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL: Section Hierarchy */}
        <div className="w-64 bg-surface-raised border-r border-border flex flex-col shrink-0">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Page Sections ({sections.filter((s) => !s.hidden).length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newSec: PageSection = {
                  id: `sec-${Date.now()}`,
                  type: "cta",
                  name: "New CTA Banner",
                  hidden: false,
                  content: { headline: "Begin Your Healing Journey", buttonText: "Get in Touch" },
                };
                setSections([...sections, newSec]);
                setActiveSectionId(newSec.id);
                notify.success("Section added", "New section appended.");
              }}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                  activeSectionId === section.id
                    ? "bg-primary/10 border-primary text-primary font-semibold"
                    : "bg-surface border-border hover:border-border-strong text-text-secondary"
                } ${section.hidden ? "opacity-40" : ""}`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-4 text-center text-text-muted font-mono">{idx + 1}</span>
                  <span className="truncate">{section.name}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => moveSection(idx, "up")}
                    disabled={idx === 0}
                    className="p-1 hover:text-text-primary disabled:opacity-20"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveSection(idx, "down")}
                    disabled={idx === sections.length - 1}
                    className="p-1 hover:text-text-primary disabled:opacity-20"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button onClick={() => toggleHideSection(section.id)} className="p-1 hover:text-text-primary">
                    {section.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                  <button onClick={() => deleteSection(section.id)} className="p-1 text-error hover:opacity-80">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-border bg-surface-subtle/50 text-xs text-text-muted text-center">
            Click any section to edit or improve with AI
          </div>
        </div>

        {/* CENTER: LIVE VISUAL CANVAS */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-surface-subtle">
          <div
            className={`transition-all duration-300 bg-surface-raised shadow-md border border-border min-h-full rounded-2xl overflow-hidden flex flex-col ${
              deviceView === "desktop"
                ? "w-full max-w-4xl"
                : deviceView === "tablet"
                ? "w-[768px]"
                : "w-[380px]"
            }`}
          >
            {/* Visual Sections Preview */}
            <div className="flex-1 space-y-0 divide-y divide-border/60">
              {sections
                .filter((s) => !s.hidden)
                .map((sec) => (
                  <div
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`relative p-8 transition-all cursor-pointer ${
                      activeSectionId === sec.id
                        ? "ring-2 ring-primary ring-inset bg-primary/5"
                        : "hover:bg-surface-subtle/30"
                    }`}
                  >
                    {/* Active Section Indicator Badge */}
                    {activeSectionId === sec.id && (
                      <div className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3" /> Selected Section
                      </div>
                    )}

                    {/* HERO SECTION COMPONENT */}
                    {sec.type === "hero" && (
                      <div className="text-center max-w-2xl mx-auto py-8">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
                          {sec.content.tagline}
                        </span>
                        <h1 className={`text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight ${brandTokens.headingFont}`}>
                          {sec.content.headline}
                        </h1>
                        <p className="text-text-secondary text-base leading-relaxed mb-6">
                          {sec.content.subhead}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <button
                            className={`px-5 py-2.5 text-white font-medium text-sm shadow-sm transition-opacity hover:opacity-90 ${brandTokens.borderRadius}`}
                            style={{ backgroundColor: brandTokens.primaryColor }}
                          >
                            {sec.content.primaryCta}
                          </button>
                          {sec.content.secondaryCta && (
                            <button
                              className={`px-5 py-2.5 border border-border text-text-primary text-sm font-medium hover:bg-surface-subtle ${brandTokens.borderRadius}`}
                            >
                              {sec.content.secondaryCta}
                            </button>
                          )}
                          {sec.content.tertiaryCta && (
                            <button className="px-4 py-2 text-xs text-text-muted hover:text-text-primary underline">
                              {sec.content.tertiaryCta}
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* TRUST SECTION COMPONENT */}
                    {sec.type === "trust" && (
                      <div className="py-2 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          {sec.content.badgeText}
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-text-secondary">
                          {sec.content.items?.map((item: string, i: number) => (
                            <span key={i} className="bg-surface-subtle px-3 py-1.5 rounded-lg border border-border">
                              ✓ {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SERVICES SECTION COMPONENT */}
                    {sec.type === "services" && (
                      <div className="py-6">
                        <div className="text-center max-w-xl mx-auto mb-6">
                          <h2 className={`text-2xl font-bold text-text-primary mb-2 ${brandTokens.headingFont}`}>
                            {sec.content.title}
                          </h2>
                          <p className="text-xs text-text-muted">{sec.content.subtitle}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {sec.content.items?.map((item: any, i: number) => (
                            <div key={i} className="p-4 rounded-xl border border-border bg-surface hover:shadow-xs">
                              <h3 className="font-semibold text-text-primary text-sm mb-1">{item.name}</h3>
                              <p className="text-xs text-text-secondary mb-3 leading-relaxed">{item.description}</p>
                              <div className="flex items-center justify-between text-xs text-text-muted font-medium pt-2 border-t border-border">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-primary" /> {item.duration}
                                </span>
                                <span className="font-bold text-primary">{item.fee}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ABOUT SECTION COMPONENT */}
                    {sec.type === "about" && (
                      <div className="py-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-secondary/10 border-2 border-secondary flex items-center justify-center text-3xl shrink-0">
                          🌿
                        </div>
                        <div>
                          <h2 className={`text-xl font-bold text-text-primary ${brandTokens.headingFont}`}>
                            {sec.content.name}
                          </h2>
                          <div className="text-xs font-semibold text-secondary mb-2">{sec.content.title}</div>
                          <p className="text-xs text-text-secondary leading-relaxed mb-2">{sec.content.bio}</p>
                          <div className="text-[11px] text-text-muted italic">{sec.content.credentials}</div>
                        </div>
                      </div>
                    )}

                    {/* TESTIMONIALS SECTION COMPONENT */}
                    {sec.type === "testimonials" && (
                      <div className="py-6 text-center max-w-xl mx-auto">
                        <div className="flex justify-center gap-1 mb-3 text-warning">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <blockquote className="text-sm font-medium text-text-primary italic mb-3 leading-relaxed">
                          "{sec.content.quote}"
                        </blockquote>
                        <div className="text-xs font-semibold text-text-primary">{sec.content.author}</div>
                        <div className="text-[11px] text-text-muted">{sec.content.location}</div>
                      </div>
                    )}

                    {/* FAQ SECTION COMPONENT */}
                    {sec.type === "faq" && (
                      <div className="py-6 max-w-2xl mx-auto">
                        <h2 className={`text-xl font-bold text-text-primary text-center mb-6 ${brandTokens.headingFont}`}>
                          {sec.content.title}
                        </h2>
                        <div className="space-y-3">
                          {sec.content.items?.map((item: any, i: number) => (
                            <div key={i} className="border border-border rounded-lg overflow-hidden bg-surface">
                              <button
                                onClick={() => setExpandedFaqIndex(expandedFaqIndex === i ? null : i)}
                                className="w-full text-left p-3.5 text-xs font-semibold text-text-primary flex items-center justify-between"
                              >
                                <span>{item.q}</span>
                                {expandedFaqIndex === i ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                                )}
                              </button>
                              {expandedFaqIndex === i && (
                                <div className="p-3.5 pt-0 text-xs text-text-secondary leading-relaxed border-t border-border/50">
                                  {item.a}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PRICING SECTION COMPONENT */}
                    {sec.type === "pricing" && (
                      <div className="py-6 text-center max-w-md mx-auto">
                        <h2 className={`text-xl font-bold text-text-primary mb-4 ${brandTokens.headingFont}`}>
                          {sec.content.title}
                        </h2>
                        <div className="bg-surface p-4 rounded-xl border border-border space-y-2 mb-3">
                          <div className="text-xs font-medium text-text-primary">{sec.content.individualRate}</div>
                          <div className="text-xs font-medium text-text-primary">{sec.content.couplesRate}</div>
                        </div>
                        <p className="text-[11px] text-text-muted italic">{sec.content.policyNote}</p>
                      </div>
                    )}

                    {/* CTA SECTION COMPONENT */}
                    {sec.type === "cta" && (
                      <div className="py-8 text-center bg-primary/5 rounded-xl border border-primary/20 p-6 my-2">
                        <h2 className={`text-2xl font-bold text-text-primary mb-2 ${brandTokens.headingFont}`}>
                          {sec.content.headline}
                        </h2>
                        <p className="text-xs text-text-secondary mb-4 max-w-md mx-auto">{sec.content.subhead}</p>
                        <button
                          className={`px-6 py-2.5 text-white font-medium text-xs shadow-sm hover:opacity-90 ${brandTokens.borderRadius}`}
                          style={{ backgroundColor: brandTokens.primaryColor }}
                        >
                          {sec.content.buttonText}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: AI DESIGN DIRECTOR & IMPROVE TOOL */}
        <div className="w-96 bg-surface-raised border-l border-border flex flex-col shrink-0">
          {/* Panel Navigation Tabs */}
          <div className="flex border-b border-border text-xs font-semibold">
            <button
              onClick={() => setSidebarTab("ai")}
              className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 ${
                sidebarTab === "ai"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              AI Director
            </button>
            <button
              onClick={() => setSidebarTab("design")}
              className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 ${
                sidebarTab === "design"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Edit Content
            </button>
            <button
              onClick={() => setSidebarTab("brand")}
              className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 ${
                sidebarTab === "brand"
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Brand Tokens
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* ── TAB 1: AI DESIGN DIRECTOR ───────────────────────────────── */}
            {sidebarTab === "ai" && (
              <div className="space-y-4">
                {/* Health & Design Score Widget */}
                <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">{auditScore}/100</div>
                    <div className="text-xs text-text-muted">UX & Conversion Score</div>
                  </div>
                  <Badge variant={auditScore >= 90 ? "success" : "warning"} className="text-xs">
                    {auditScore >= 90 ? "Excellent" : "Needs Review"}
                  </Badge>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    AI Design Recommendations
                  </div>

                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                        rec.applied
                          ? "bg-success/5 border-success/30"
                          : "bg-surface border-border hover:border-border-strong"
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-text-primary">{rec.title}</span>
                        <Badge variant={rec.severity === "high" ? "error" : "warning"} className="text-[10px]">
                          {rec.type}
                        </Badge>
                      </div>
                      <p className="text-text-muted text-[11px] leading-relaxed">{rec.problem}</p>
                      <div className="bg-surface-subtle p-2 rounded-md text-[11px] text-text-secondary border border-border">
                        <strong>Solution:</strong> {rec.solution}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        {rec.applied ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[11px] h-7 text-text-muted"
                            onClick={() => undoDesignFix(rec.id)}
                          >
                            <Undo2 className="w-3 h-3 mr-1" /> Undo
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-[11px] h-7"
                            onClick={() => applyDesignFix(rec.id)}
                          >
                            Apply Fix
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Section Improver Box */}
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    Improve Selected: {activeSection.name}
                  </div>

                  <div>
                    <label className="text-[11px] text-text-muted block mb-1">Select Improvement Goal</label>
                    <select
                      value={selectedGoal}
                      onChange={(e) => setSelectedGoal(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-border bg-surface focus:outline-none"
                    >
                      <option value="warmer">Make Warmer & Compassionate</option>
                      <option value="clearer">Make Clearer & Jargon-Free</option>
                      <option value="shorter">Make Shorter (Mobile-Optimized)</option>
                      <option value="more_professional">Elevate Clinical Rigor</option>
                      <option value="improve_cta">Strengthen Safe CTA</option>
                      <option value="improve_seo">Optimize for Local Intent</option>
                    </select>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={handleRegenerateWithAi}
                    loading={isRegenerating}
                  >
                    Generate AI Improvement
                  </Button>

                  {/* Before / After Preview Diff */}
                  {aiDiff && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-surface border border-secondary/30 rounded-xl space-y-2 text-xs"
                    >
                      <div className="font-semibold text-secondary flex items-center justify-between">
                        <span>AI Proposal</span>
                        <span className="text-[10px] text-text-muted">Diff Preview</span>
                      </div>
                      <p className="text-[11px] text-text-muted italic">{aiDiff.explanation}</p>

                      <div className="space-y-1.5 text-[11px]">
                        <div className="bg-error/10 border border-error/20 p-2 rounded text-error">
                          <strong>Before:</strong> {JSON.stringify(aiDiff.before.headline || aiDiff.before.title || "Original")}
                        </div>
                        <div className="bg-success/10 border border-success/20 p-2 rounded text-success">
                          <strong>After:</strong> {JSON.stringify(aiDiff.after.headline || aiDiff.after.title || "Proposed")}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="ghost" size="sm" className="flex-1 h-7 text-[11px]" onClick={() => setAiDiff(null)}>
                          Discard
                        </Button>
                        <Button variant="primary" size="sm" className="flex-1 h-7 text-[11px]" onClick={acceptAiDiff}>
                          <Check className="w-3 h-3 mr-1" /> Accept & Apply
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 2: DIRECT CONTENT EDITOR ────────────────────────────── */}
            {sidebarTab === "design" && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Editing: {activeSection.name}
                </div>

                {Object.entries(activeSection.content).map(([key, value]) => {
                  if (typeof value === "string") {
                    return (
                      <div key={key} className="space-y-1">
                        <label className="text-[11px] font-semibold text-text-muted capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </label>
                        {value.length > 50 ? (
                          <textarea
                            value={value}
                            rows={3}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSections((prev) =>
                                prev.map((s) =>
                                  s.id === activeSectionId
                                    ? { ...s, content: { ...s.content, [key]: val } }
                                    : s
                                )
                              );
                            }}
                            className="w-full text-xs p-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        ) : (
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSections((prev) =>
                                prev.map((s) =>
                                  s.id === activeSectionId
                                    ? { ...s, content: { ...s.content, [key]: val } }
                                    : s
                                )
                              );
                            }}
                            className="w-full text-xs p-2 border border-border rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {/* ── TAB 3: BRAND TOKENS STUDIO ──────────────────────────────── */}
            {sidebarTab === "brand" && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Brand Design Tokens
                </div>
                <p className="text-[11px] text-text-muted">
                  Tokens cascade across all practice pages for consistent visual identity.
                </p>

                {/* Primary Color Palette */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-text-muted block">Primary Palette</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: "Forest", hex: "#2D6A4F" },
                      { name: "Violet", hex: "#7B6FA0" },
                      { name: "Earth", hex: "#8B5E3C" },
                      { name: "Ocean", hex: "#2A6F97" },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setBrandTokens({ ...brandTokens, primaryColor: c.hex })}
                        className={`p-2 rounded-lg border text-center text-[10px] font-medium transition-all ${
                          brandTokens.primaryColor === c.hex ? "border-text-primary ring-2 ring-primary/20" : "border-border"
                        }`}
                      >
                        <div className="w-full h-5 rounded mb-1" style={{ backgroundColor: c.hex }} />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Radius */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-text-muted block">Border Radius</label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { label: "Subtle", val: "rounded-md" },
                      { label: "Standard", val: "rounded-xl" },
                      { label: "Soft", val: "rounded-2xl" },
                    ].map((r) => (
                      <button
                        key={r.val}
                        onClick={() => setBrandTokens({ ...brandTokens, borderRadius: r.val })}
                        className={`p-2 border rounded-lg text-center text-xs ${
                          brandTokens.borderRadius === r.val ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border text-text-secondary"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Heading Typography */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-text-muted block">Heading Typography</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setBrandTokens({ ...brandTokens, headingFont: "font-serif" })}
                      className={`p-2 border rounded-lg text-center font-serif ${
                        brandTokens.headingFont === "font-serif" ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border text-text-secondary"
                      }`}
                    >
                      Lora Serif
                    </button>
                    <button
                      onClick={() => setBrandTokens({ ...brandTokens, headingFont: "font-sans" })}
                      className={`p-2 border rounded-lg text-center font-sans ${
                        brandTokens.headingFont === "font-sans" ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border text-text-secondary"
                      }`}
                    >
                      Inter Sans
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setBrandTokens({
                        primaryColor: "#2D6A4F",
                        secondaryColor: "#7B6FA0",
                        borderRadius: "rounded-xl",
                        headingFont: "font-serif",
                      });
                      notify.info("Tokens reset", "Restored standard wellness theme tokens.");
                    }}
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset to Defaults
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
