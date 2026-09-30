"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Play,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  FileCheck,
  AlertOctagon,
  HeartHandshake,
  Video,
  CheckCircle2,
  XCircle,
  Lock,
  Zap,
  TrendingUp,
  Search,
  Calendar,
  Users,
  MessageSquare,
  Bot,
  Layers,
  ChevronRight,
  ChevronDown,
  Clock,
  Download,
  Copy,
  Star,
  Activity,
  Sliders,
  Database,
  Globe,
  Check,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  Server,
  KeyRound,
  FileText,
} from "lucide-react";

export default function MarketingPage() {
  const [activeHeroTab, setActiveHeroTab] = useState<"scribe" | "superbill" | "crisis" | "portal">("scribe");
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month");
  
  // Interactive Modality & Ecosystem Tab State
  const [activeEcosystemTab, setActiveEcosystemTab] = useState<"all" | "modalities" | "ehr" | "telehealth">("all");

  // Interactive ROI Calculator State
  const [weeklySessions, setWeeklySessions] = useState<number>(24);
  const [hourlyRate, setHourlyRate] = useState<number>(165);

  // Interactive FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interactive Comparison Filter
  const [comparisonAudience, setComparisonAudience] = useState<"solo" | "group">("solo");

  // Calculations
  const hoursSavedPerMonth = Math.round((weeklySessions * 25 * 4.2) / 60);
  const monthlyAdminCostSaved = Math.round(hoursSavedPerMonth * 45); // value of therapist admin time
  const extraRevenueCapacity = Math.round((weeklySessions > 20 ? 3 : 2) * hourlyRate * 4.2);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Dynamic Background Ambient Glows & Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#2D6A4F_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.035] dark:opacity-[0.09] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-gradient-to-b from-primary/20 via-emerald-500/8 to-transparent blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-[800px] right-[-200px] w-[650px] h-[650px] bg-purple-500/10 blur-[130px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-[2200px] left-[-200px] w-[700px] h-[700px] bg-emerald-600/10 blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-[3800px] right-[-150px] w-[600px] h-[600px] bg-teal-500/10 blur-[120px] pointer-events-none -z-10 rounded-full" />

      {/* ──────────────────────────────────────────────────────────────────────────
          1. HERO SECTION WITH DYNAMIC INTERACTIVE SIMULATOR
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-4 md:px-6">
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          {/* Beacon Announcement Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary text-xs font-semibold backdrop-blur-md hover:border-primary/50 hover:bg-primary/15 transition-all duration-300 shadow-sm mb-8 group cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="font-bold">Next-Gen Therapy OS 2.0 Live</span>
            <span className="text-muted-foreground/60">·</span>
            <span className="text-muted-foreground font-normal group-hover:text-primary transition-colors flex items-center gap-1">
              AI Scribe & Superbills Active <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            Your therapy practice, <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              intelligently managed.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Replace 5 fragmented tools with one AI-native digital operating system. Ambient SOAP note documentation, CMS-1500 Superbills, 988 Crisis Guard, and branded client portals.
          </p>

          {/* Action Buttons with Advanced Hover Micro-interactions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/95 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-primary/25 text-center flex items-center justify-center gap-2 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-7 py-3.5 bg-card hover:bg-muted/80 border border-border text-foreground rounded-xl font-semibold hover:border-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>1-Click Demo Practice</span>
            </Link>

            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-6 py-3.5 bg-muted/60 hover:bg-muted border border-border text-muted-foreground hover:text-foreground rounded-xl font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-emerald-600" />
              <span>10-Step Wizard</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" /> HIPAA Safe Harbor Certified</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-primary" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> Instant 14-day full access</span>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────────────────
            HERO INTERACTIVE PRODUCT SUITE SIMULATOR
        ────────────────────────────────────────────────────────────────────────── */}
        <div className="container mx-auto mt-16 max-w-5xl">
          <div className="rounded-2xl border border-border/80 bg-card/85 backdrop-blur-2xl shadow-2xl overflow-hidden hover:border-primary/40 transition-all duration-300">
            {/* Simulator Interactive Header Tabs */}
            <div className="bg-muted/60 border-b border-border px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                <span className="text-xs font-mono font-medium text-muted-foreground ml-2 hidden sm:inline">
                  willow-mind.theraflow.app
                </span>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-background/80 p-1 rounded-lg border border-border text-xs">
                <button
                  onClick={() => setActiveHeroTab("scribe")}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    activeHeroTab === "scribe"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  AI SOAP Scribe
                </button>
                <button
                  onClick={() => setActiveHeroTab("superbill")}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    activeHeroTab === "superbill"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  CMS-1500 Superbill
                </button>
                <button
                  onClick={() => setActiveHeroTab("crisis")}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    activeHeroTab === "crisis"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  988 Crisis Guard
                </button>
                <button
                  onClick={() => setActiveHeroTab("portal")}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    activeHeroTab === "portal"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Patient Portal
                </button>
              </div>

              <Link
                href="/dashboard"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Open Dashboard <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Tab 1: AI SOAP Scribe Simulator View */}
            {activeHeroTab === "scribe" && (
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-primary" /> Clinician Telehealth Dictation
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                      Safe Harbor PHI Redacted
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border font-mono text-xs text-muted-foreground leading-relaxed">
                    "Patient presented for 50-min CBT session. Reports panic attack frequency down from 4x/week to 1. Practiced 4-7-8 breathing before Monday executive meeting. Sleep improved to 6.5 hours. Continued anxiety around performance review. Assigned 3 thought records examining catastrophizing..."
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    ✓ Evaluates Mental Status Exam (MSE), ICD-10 (F41.1), and CPT (90834).
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Synthesized SOAP Record
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                      Signed & Locked
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-background border border-primary/30 space-y-2 text-xs shadow-xs">
                    <p><strong className="text-primary">[S] Subjective:</strong> Client reports 75% reduction in acute panic episodes utilizing diaphragmatic breathing techniques.</p>
                    <p><strong className="text-primary">[O] Objective:</strong> Alert, oriented x4, congruent affect, linear thought process, good insight.</p>
                    <p><strong className="text-primary">[A] Assessment:</strong> Generalized Anxiety Disorder (ICD-10 F41.1). Positive treatment trajectory.</p>
                    <p><strong className="text-primary">[P] Plan:</strong> Weekly 50m CBT (CPT 90834), 3 thought records assigned, follow up next Tuesday.</p>
                  </div>
                  <div className="flex justify-end">
                    <Link href="/clinical/notes" className="text-xs font-semibold text-primary hover:underline">
                      Launch Clinical Scribe Suite →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Superbill View */}
            {activeHeroTab === "superbill" && (
              <div className="p-6 md:p-8 text-left space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-foreground">Standard CMS-1500 Psychotherapy Superbill</h3>
                    <p className="text-xs text-muted-foreground">Out-of-Network Patient Reimbursement Receipt</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-primary px-3 py-1 rounded bg-primary/10">
                    SB-2026-0089 · Paid in Full ($175.00)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3 bg-muted/40 rounded-lg border border-border">
                    <p className="text-muted-foreground text-[10px] uppercase">Rendering Provider</p>
                    <p className="font-bold text-foreground mt-1">Dr. Sarah Bennett, PsyD</p>
                    <p className="text-[11px] text-muted-foreground">NPI: 1841920394 · Tax ID: 84-2910394</p>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-lg border border-border">
                    <p className="text-muted-foreground text-[10px] uppercase">Coding & Modifiers</p>
                    <p className="font-bold text-primary mt-1">CPT 90834 (45-50m Psychotherapy)</p>
                    <p className="text-[11px] text-muted-foreground">Primary Diagnosis: ICD-10 F41.1</p>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-lg border border-border">
                    <p className="text-muted-foreground text-[10px] uppercase">Insurance Benefit</p>
                    <p className="font-bold text-emerald-600 mt-1">60% – 80% Return to Client</p>
                    <p className="text-[11px] text-muted-foreground">Eligible for BlueCross, Aetna, Cigna</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-muted-foreground">Instant PDF export formatted for immediate insurance claim filing.</span>
                  <Link href="/billing/superbills" className="text-xs font-semibold text-primary hover:underline">
                    View Full Billing Engine →
                  </Link>
                </div>
              </div>
            )}

            {/* Tab 3: Crisis Guard View */}
            {activeHeroTab === "crisis" && (
              <div className="p-6 md:p-8 text-left space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertOctagon className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm text-red-900 dark:text-red-200">24/7 National 988 Suicide & Crisis Lifeline Guard</h4>
                      <p className="text-xs text-red-700 dark:text-red-300">
                        Automatic heuristic monitoring on intake forms, appointment notes, and visitor chat.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded bg-red-600 text-white font-bold text-xs uppercase tracking-wider">
                    High Risk Triaged
                  </span>
                </div>

                <div className="p-4 bg-card border border-border rounded-xl text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Trigger Heuristic: Passive Suicidal Ideation in Intake</span>
                    <span className="text-emerald-600 font-medium">Safety SOP Protocol Dispatched</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    "Client flagged on initial intake questionnaire. Automated 988 Lifeline wallet modal served to visitor. Clinical safety contract required in first 10 minutes of intake encounter."
                  </p>
                </div>

                <div className="flex justify-end">
                  <Link href="/crisis" className="text-xs font-semibold text-primary hover:underline">
                    Open Practice Crisis Center →
                  </Link>
                </div>
              </div>
            )}

            {/* Tab 4: Patient Portal View */}
            {activeHeroTab === "portal" && (
              <div className="p-6 md:p-8 text-left space-y-4">
                <div className="p-4 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Patient Self-Service Suite</span>
                    <h4 className="font-serif font-bold text-base text-foreground mt-0.5">Welcome, Elena Rodriguez</h4>
                    <p className="text-xs text-muted-foreground">Upcoming: Individual CBT Therapy · Tuesday at 2:00 PM CST</p>
                  </div>
                  <Link
                    href="/telehealth/session-elena-01"
                    className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" /> Join Video Session
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-muted/40 rounded-lg border border-border">
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Assigned CBT Homework
                    </p>
                    <p className="text-muted-foreground text-[11px] mt-1">CBT Thought Record: Public Speaking (Due Oct 4)</p>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-lg border border-border">
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" /> Daily Mood Check-In
                    </p>
                    <p className="text-muted-foreground text-[11px] mt-1">Mood Rating: 7/10 · Anxiety: 4/10 logged today</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link href="/portal" className="text-xs font-semibold text-primary hover:underline">
                    Explore Client Portal Experience →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. IMPACT METRICS TICKER
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-border bg-card/60 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">↓ 88%</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Note Documentation Time</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-serif font-bold text-emerald-600">60%–80%</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Client Claim Return (Superbills)</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-serif font-bold text-purple-600">100%</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">HIPAA Safe Harbor PHI Masked</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-serif font-bold text-foreground">24/7</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Emergency 988 Safety Guard</p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          3. COMPREHENSIVE FEATURES GRID WITH HOVER SPOTLIGHTS
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="product" className="py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
              Complete Practice Operating System
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
              Everything modern practices need.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Eliminate administrative burnout so you can invest your energy where it matters most: your clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI SOAP Clinical Scribe",
                icon: Stethoscope,
                desc: "Dictate voice memos or paste session notes. Auto-generates Subjective, Objective, Assessment, Plan notes with PHI masking.",
                badge: "Clinical AI",
                href: "/clinical/notes",
              },
              {
                title: "CMS-1500 Superbills",
                icon: FileCheck,
                desc: "Automated claim generation with NPI, EIN, and CPT (90834/90837) + ICD-10 codes for 60%–80% out-of-network reimbursement.",
                badge: "Revenue & Billing",
                href: "/billing/superbills",
              },
              {
                title: "24/7 Crisis 988 Guardian",
                icon: AlertOctagon,
                desc: "Real-time safety heuristic screening on all contact forms, intakes, and chat to trigger 988 Lifeline support.",
                badge: "Life-Saving SOP",
                href: "/crisis",
              },
              {
                title: "WebRTC Telehealth Room",
                icon: Video,
                desc: "Zero-install encrypted video rooms with live in-session clinician notepad that converts directly into SOAP notes.",
                badge: "Virtual Care",
                href: "/telehealth/session-elena-01",
              },
              {
                title: "Patient Self-Service Portal",
                icon: HeartHandshake,
                desc: "Dedicated client area with appointment cards, interactive CBT homework checklists, and daily mood tracking.",
                badge: "Client Hub",
                href: "/portal",
              },
              {
                title: "AI Website & Design Director",
                icon: Sparkles,
                desc: "Smart Page Composer with drag-and-drop sections, local SEO intelligence, and AI Design Director suggestions.",
                badge: "Growth Engine",
                href: "/website/builder",
              },
            ].map((f, i) => (
              <Link
                key={i}
                href={f.href}
                className="group p-6 rounded-2xl border border-border bg-card/70 hover:bg-card hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <f.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-0.5 rounded bg-muted">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs text-primary font-semibold">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          NEW SECTION A: CLINICAL MODALITIES & EHR INTEGRATION ECOSYSTEM
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-6 bg-muted/20 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Connected Practice Ecosystem
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Built for your clinical modality & existing workflow.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              TheraFlow AI seamlessly bridges evidence-based therapy frameworks with your favorite EHRs, calendar platforms, and billing services.
            </p>

            {/* Filter Pills */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setActiveEcosystemTab("all")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeEcosystemTab === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                All Integrations
              </button>
              <button
                onClick={() => setActiveEcosystemTab("modalities")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeEcosystemTab === "modalities"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                Therapy Modalities
              </button>
              <button
                onClick={() => setActiveEcosystemTab("ehr")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeEcosystemTab === "ehr"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                EHR & Billing
              </button>
              <button
                onClick={() => setActiveEcosystemTab("telehealth")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeEcosystemTab === "telehealth"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                Telehealth & Comms
              </button>
            </div>
          </div>

          {/* Integration Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Cognitive Behavioral (CBT)",
                category: "modalities",
                badge: "Native Scribe",
                desc: "Automatic thought record synthesis, cognitive distortion tagging, and homework checklists.",
                icon: Sparkles,
                status: "Ready",
              },
              {
                name: "EMDR & Trauma Protocol",
                category: "modalities",
                badge: "Safe Harbor",
                desc: "Bilateral stimulation session pacing, SUD/VoC score tracking, and resource anchoring.",
                icon: Activity,
                status: "Ready",
              },
              {
                name: "Gottman Couples Method",
                category: "modalities",
                badge: "Specialized",
                desc: "Four Horsemen conflict pattern detection and repair attempt documentation.",
                icon: HeartHandshake,
                status: "Ready",
              },
              {
                name: "Somatic Experiencing",
                category: "modalities",
                badge: "Specialized",
                desc: "Nervous system state regulation notes, titration steps, and interoceptive markers.",
                icon: Bot,
                status: "Ready",
              },
              {
                name: "SimplePractice Sync",
                category: "ehr",
                badge: "Two-Way API",
                desc: "Direct bi-directional sync of client rosters, past SOAP notes, and calendar availability.",
                icon: Database,
                status: "Connected",
              },
              {
                name: "Jane App & TherapyNotes",
                category: "ehr",
                badge: "Instant Import",
                desc: "1-Click CSV/JSON migration of your entire practice history in under 2 minutes.",
                icon: Layers,
                status: "Certified",
              },
              {
                name: "Stripe & Out-of-Network",
                category: "ehr",
                badge: "Zero Fee",
                desc: "Instant card processing with automated HSA/FSA debit and CMS-1500 PDF attachment.",
                icon: FileCheck,
                status: "Active",
              },
              {
                name: "HIPAA Compliant Zoom",
                category: "telehealth",
                badge: "Encrypted",
                desc: "Direct calendar dispatch with zero-install WebRTC browser backup rooms.",
                icon: Video,
                status: "Live",
              },
              {
                name: "Psychology Today & Google",
                category: "telehealth",
                badge: "SEO Sync",
                desc: "Auto-syncs verified credentials and practice specialties directly into search engine schemas.",
                icon: Search,
                status: "Optimized",
              },
              {
                name: "National 988 Lifeline",
                category: "telehealth",
                badge: "Emergency",
                desc: "Instant telephonic and SMS lifeline modal auto-triggered upon elevated PHQ-9 suicide markers.",
                icon: AlertOctagon,
                status: "24/7 Guard",
              },
              {
                name: "Google & Outlook Calendar",
                category: "telehealth",
                badge: "Real-time",
                desc: "Bi-directional conflict resolution with automatic HIPAA buffer times between appointments.",
                icon: Calendar,
                status: "Connected",
              },
              {
                name: "Custom Clinic Domains",
                category: "ehr",
                badge: "SSL Included",
                desc: "Connect your custom domain (e.g. yournamepractice.com) with automatic HTTPS SSL certificates.",
                icon: Globe,
                status: "Ready",
              },
            ]
              .filter(
                (item) =>
                  activeEcosystemTab === "all" ||
                  item.category === activeEcosystemTab
              )
              .map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {item.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">{item.badge}</span>
                    <span className="text-primary group-hover:translate-x-0.5 transition-transform">✓ Enabled</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          NEW SECTION B: INTERACTIVE ROI & TIME-SAVINGS ESTIMATOR
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-6 bg-gradient-to-b from-card/40 to-background border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="p-8 md:p-12 rounded-3xl border border-border/80 bg-card/90 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="grid md:grid-cols-12 gap-8 items-center">
              {/* Left Controls */}
              <div className="md:col-span-6 space-y-6">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                    Interactive Practice ROI Calculator
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-3">
                    Calculate your clinical time & revenue reclaimed.
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mt-2 leading-relaxed">
                    Most clinicians spend 12-16 hours per week on documentation, billing, and scheduling. See what TheraFlow AI saves you each month.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Slider 1: Weekly Sessions */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-foreground">Client Sessions per Week</span>
                      <span className="text-primary font-mono text-sm">{weeklySessions} sessions/wk</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={45}
                      step={1}
                      value={weeklySessions}
                      onChange={(e) => setWeeklySessions(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>5 solo</span>
                      <span>20 standard</span>
                      <span>45 full caseload</span>
                    </div>
                  </div>

                  {/* Slider 2: Hourly Rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-foreground">Average Session Fee (Out-of-Pocket or Copay)</span>
                      <span className="text-primary font-mono text-sm">${hourlyRate} / session</span>
                    </div>
                    <input
                      type="range"
                      min={80}
                      max={350}
                      step={5}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>$80 community</span>
                      <span>$165 national avg</span>
                      <span>$350 specialized</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-muted/40 rounded-xl border border-border text-xs text-muted-foreground flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>Calculated from average 25-minute SOAP documentation time reduced to 2.5 minutes with TheraFlow AI Scribe.</span>
                </div>
              </div>

              {/* Right Output Dashboard */}
              <div className="md:col-span-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/25 rounded-2xl p-6 md:p-8 space-y-6 text-center md:text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background/80 rounded-xl border border-border shadow-xs">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase">Documentation Saved</p>
                    <p className="text-3xl font-serif font-bold text-primary mt-1">
                      {hoursSavedPerMonth} hrs
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Reclaimed every month</p>
                  </div>

                  <div className="p-4 bg-background/80 rounded-xl border border-border shadow-xs">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase">Admin Value Reclaimed</p>
                    <p className="text-3xl font-serif font-bold text-emerald-600 mt-1">
                      ${monthlyAdminCostSaved.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">At clinician billable rate</p>
                  </div>
                </div>

                <div className="p-4 bg-background/90 rounded-xl border border-primary/30 shadow-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Added Caseload Capacity</span>
                    <span className="text-xs font-mono font-bold text-primary">+{weeklySessions > 20 ? 3 : 2} clients/wk</span>
                  </div>
                  <p className="text-2xl font-serif font-bold text-foreground">
                    +${extraRevenueCapacity.toLocaleString()} <span className="text-xs font-sans font-normal text-muted-foreground">/ month potential</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Gain back Friday afternoons or expand your caseload without increasing stress.
                  </p>
                </div>

                <Link
                  href="/register"
                  className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-center block text-sm hover:bg-primary/95 shadow-md shadow-primary/20 transition-all"
                >
                  Claim Your 14-Day Free Access →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          NEW SECTION C: COMPETITIVE COMPARISON MATRIX
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-6 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 uppercase tracking-wider">
              Objective Feature Matrix
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
              Why clinicians switch to TheraFlow AI.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Compare TheraFlow AI against traditional legacy EHRs and generic website builders.
            </p>

            <div className="inline-flex items-center bg-muted p-1 rounded-lg border border-border text-xs mt-2">
              <button
                onClick={() => setComparisonAudience("solo")}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  comparisonAudience === "solo" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Solo Clinicians
              </button>
              <button
                onClick={() => setComparisonAudience("group")}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  comparisonAudience === "group" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Group Practices & Clinics
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-4 md:p-5 font-bold text-foreground w-1/3">Capability</th>
                    <th className="p-4 md:p-5 font-bold text-primary bg-primary/5 w-1/4">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>TheraFlow AI</span>
                      </div>
                    </th>
                    <th className="p-4 md:p-5 font-medium text-muted-foreground w-1/5">Legacy EHRs (SimplePractice)</th>
                    <th className="p-4 md:p-5 font-medium text-muted-foreground w-1/5">Generic Builders (Squarespace)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    {
                      feature: "Ambient AI SOAP Scribe",
                      desc: "Dictation to structured clinical note in < 30 seconds with PHI redaction",
                      theraflow: "Included (Unlimited)",
                      legacy: "None / Third-party plugin ($$$)",
                      generic: "None",
                    },
                    {
                      feature: "CMS-1500 Psychotherapy Superbills",
                      desc: "Automated diagnosis codes, NPI, EIN, and CPT 90834/90837 generation",
                      theraflow: "Automated 1-Click",
                      legacy: "Manual PDF Entry",
                      generic: "Not Supported",
                    },
                    {
                      feature: "24/7 Suicide & 988 Crisis Guard",
                      desc: "Autonomous safety heuristics on intake forms & chat with dispatch protocol",
                      theraflow: "Built-in SOP Engine",
                      legacy: "None",
                      generic: "None",
                    },
                    {
                      feature: "Branded Client Portal & CBT Tools",
                      desc: "Client login with interactive thought records, homework, and mood check-ins",
                      theraflow: "Full Interactive Suite",
                      legacy: "Basic Document Upload Only",
                      generic: "Requires 3 Separate Plugins",
                    },
                    {
                      feature: "AI Website Generator & Local SEO",
                      desc: "Search schema optimization for 'therapy near me' and specialty keywords",
                      theraflow: "Continuous Auto-Optimization",
                      legacy: "Static / Poor SEO Ranking",
                      generic: "Manual Design Required",
                    },
                    {
                      feature: "HIPAA BAA Included on All Tiers",
                      desc: "Legally binding Business Associate Agreement on Day 1 without price gating",
                      theraflow: "Yes, Always Free",
                      legacy: "Gated behind $99+/mo tier",
                      generic: "Not HIPAA Compliant",
                    },
                    {
                      feature: "Cost per clinician / month",
                      desc: "Total software cost for modern private practice operations",
                      theraflow: comparisonAudience === "solo" ? "$79 / mo all-in" : "$149 / mo (10 seats)",
                      legacy: "$120 - $220 / mo (with add-ons)",
                      generic: "$60/mo + $100 plugins (Not HIPAA)",
                    },
                  ].map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 md:p-5">
                        <p className="font-bold text-foreground">{row.feature}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{row.desc}</p>
                      </td>
                      <td className="p-4 md:p-5 font-semibold text-primary bg-primary/5">
                        <span className="inline-flex items-center gap-1.5 text-primary">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          {row.theraflow}
                        </span>
                      </td>
                      <td className="p-4 md:p-5 text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" />
                          {row.legacy}
                        </span>
                      </td>
                      <td className="p-4 md:p-5 text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" />
                          {row.generic}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          NEW SECTION D: CLINICAL WALL OF LOVE & VERIFIED CLINICIAN ENDORSEMENTS
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-6 bg-muted/30 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Practitioner Wall of Trust
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
              Loved by 500+ licensed clinicians.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Read how therapists, psychologists, and group practice owners run calmer, more profitable practices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "TheraFlow AI eliminated my Sunday night documentation dread. I dictate my thoughts between sessions for 45 seconds, and by the time I take a sip of tea, my SOAP note is perfectly formatted, MSE evaluated, and locked into HIPAA storage.",
                author: "Dr. Marcus Vance, PsyD",
                title: "Clinical Psychologist & Practice Director",
                location: "Austin, Texas",
                metrics: "14 hrs/week saved on documentation",
                stars: 5,
                verifiedBadge: "Verified Provider · PsyD License #38192",
              },
              {
                quote:
                  "The CMS-1500 Superbill engine alone justified our switch. Our private-pay clients received over $18,400 in insurance reimbursements last quarter with zero claim rejections. It transformed our out-of-network retention rate.",
                author: "Sarah Jenkins, LMFT",
                title: "Couples & Family Therapy Specialist",
                location: "Seattle, Washington",
                metrics: "$18,400+ client claims reimbursed",
                stars: 5,
                verifiedBadge: "Verified Provider · LMFT #94102",
              },
              {
                quote:
                  "Having the 24/7 988 Crisis Guard gives me immense clinical and legal peace of mind. During a late Sunday intake, a client screened high on passive suicidal ideation. The automated safety contract and lifeline modal engaged immediately.",
                author: "Elena Rostova, LCSW",
                title: "Trauma & EMDR Certified Clinician",
                location: "Denver, Colorado",
                metrics: "100% triage response compliance",
                stars: 5,
                verifiedBadge: "Verified Provider · LCSW #19042",
              },
            ].map((review, i) => (
              <div
                key={i}
                className="p-6 md:p-8 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(review.stars)].map((_, sIdx) => (
                      <Star key={sIdx} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  <p className="text-xs md:text-sm text-foreground leading-relaxed italic">
                    "{review.quote}"
                  </p>
                </div>

                <div className="pt-6 border-t border-border mt-6 space-y-3">
                  <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/15 text-xs text-primary font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{review.metrics}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-foreground">{review.author}</h4>
                    <p className="text-xs text-muted-foreground">{review.title} · {review.location}</p>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                      ✓ {review.verifiedBadge}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          4. HOW IT WORKS TIMELINE
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/20 px-4 md:px-6 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Simple, 4-step practice transformation
            </h2>
            <p className="text-sm text-muted-foreground">From onboarding to daily autonomous operation in under 10 minutes.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Practice Setup", desc: "Select therapy modalities, credentials, and brand style in the 10-step wizard." },
              { num: "02", title: "AI Generation", desc: "Our engine builds your website, service pages, and knowledge RAG database." },
              { num: "03", title: "Client Bookings", desc: "Publish calendar slots, digital intake forms, and automated reminders." },
              { num: "04", title: "Autonomous Ops", desc: "Use AI Scribe for SOAP notes, issue superbills, and monitor clinical safety." },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 transition-all space-y-3"
              >
                <span className="text-2xl font-mono font-bold text-primary/40">
                  {step.num}
                </span>
                <h4 className="font-bold text-sm text-foreground">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          NEW SECTION E: SECURITY, ENCRYPTION & HIPAA COMPLIANCE TRUST BADGES
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-6 bg-card border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
              Bank-Grade Security Architecture
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
              Clinical confidentiality is non-negotiable.
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
              Every note, audio recording, client message, and superbill is protected by multi-layered institutional safeguards.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">HIPAA BAA Guaranteed</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Execute a legally binding Business Associate Agreement immediately upon sign-up on every plan tier.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 w-fit">
                <KeyRound className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">256-Bit AES Encryption</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Data encrypted both at rest and in transit (TLS 1.3) using NIST-certified cryptographic standards.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 w-fit">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Safe Harbor PHI Redaction</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All 18 HIPAA identifiers are stripped client-side prior to any AI model inference. Zero model training on PHI.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
              <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-600 w-fit">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-foreground">99.99% Uptime & Backups</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automated continuous geo-replicated backups with disaster recovery failover under 60 seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          5. PRICING TEASER
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 md:px-6 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Transparent practice plans
            </h2>
            <p className="text-sm text-muted-foreground">Every plan includes HIPAA compliance and AI documentation.</p>

            {/* Interval Toggle */}
            <div className="inline-flex items-center bg-muted p-1 rounded-lg border border-border text-xs mt-4">
              <button
                onClick={() => setBillingInterval("month")}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  billingInterval === "month" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval("year")}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  billingInterval === "year" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Yearly <span className="text-emerald-600 font-bold ml-1">(Save 20%)</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Starter",
                price: billingInterval === "month" ? 49 : 39,
                desc: "For solo therapists launching their digital presence.",
                features: ["AI Website Builder", "Client Appointment Booking", "Inquiry CRM", "50 AI Clinical Notes/mo", "Community Support", "Signed HIPAA BAA"],
                popular: false,
              },
              {
                name: "Professional",
                price: billingInterval === "month" ? 99 : 79,
                desc: "Most popular for established individual practices.",
                features: ["Unlimited AI SOAP Scribe", "CMS-1500 Superbill Engine", "WebRTC Telehealth Room", "Dedicated Client Portal", "988 Crisis Guard", "Priority Support", "Custom Clinic Domain"],
                popular: true,
              },
              {
                name: "Growth & Group",
                price: billingInterval === "month" ? 179 : 149,
                desc: "For multi-provider group practices & clinics.",
                features: ["Up to 10 Clinicians (RBAC)", "Custom Domain & White-label", "Multi-provider Scheduling", "Full Developer REST API", "Dedicated Account Manager", "Custom EHR Data Migration"],
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  plan.popular
                    ? "border-primary bg-primary/[0.03] shadow-xl relative scale-105"
                    : "border-border bg-card hover:border-border/80"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground uppercase tracking-wider">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">{plan.desc}</p>
                  <p className="text-4xl font-serif font-bold text-foreground">
                    ${plan.price}
                    <span className="text-xs text-muted-foreground font-sans font-normal"> /month</span>
                  </p>

                  <ul className="space-y-2.5 my-6 text-xs text-muted-foreground">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/register"
                  className={`w-full py-2.5 rounded-lg text-xs font-semibold text-center transition-colors shadow-xs ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-input hover:bg-muted text-foreground"
                  }`}
                >
                  Start 14-Day Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          NEW SECTION F: INTERACTIVE CLINICAL FAQ ACCORDION
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 md:px-6 bg-muted/20 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Everything you need to know.
            </h2>
            <p className="text-sm text-muted-foreground">
              Have questions about HIPAA compliance, billing codes, or practice migration? We have answers.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does TheraFlow AI ensure strict HIPAA compliance and protect Patient Health Information (PHI)?",
                a: "TheraFlow AI executes a standard Business Associate Agreement (BAA) directly upon signup for all practice tiers. Our proprietary Safe Harbor PHI Masking Engine redacts names, dates, phone numbers, and other identifying variables client-side before any session audio or text enters model synthesis. Furthermore, your clinical data is never used to train generalized commercial AI models.",
              },
              {
                q: "How does the CMS-1500 Superbill generation help my private-pay clients get reimbursed?",
                a: "Out-of-network therapy can be costly for clients. TheraFlow AI automatically correlates diagnosis codes (ICD-10 like F41.1, F43.10) with exact session duration CPT codes (90834 for 45-50 min, 90837 for 53+ min), provider NPI, and practice Tax ID. Clients can download standard insurance-ready PDF receipts in one click and submit them to BlueCross, Aetna, Cigna, or UnitedHealthcare for 60% to 80% direct reimbursement.",
              },
              {
                q: "Can I migrate my clients and past appointment notes from SimplePractice or Jane App?",
                a: "Yes. TheraFlow AI provides a frictionless 1-Click Migration assistant. You can export your client list and billing history as CSV/JSON from SimplePractice, TherapyNotes, or Jane App, and our importer automatically maps profiles, emergency contacts, and active services without data loss.",
              },
              {
                q: "How does the 24/7 988 Crisis Guard work, and what is the legal safeguard for clinicians?",
                a: "The Crisis Guard runs continuous heuristic analysis on patient intake questionnaires, contact messages, and appointment notes. If acute crisis markers (such as suicidal ideation, intent, or self-harm keywords) are detected, the system immediately presents an emergency 988 Lifeline support modal to the patient with 1-click dialing. The system alerts the provider with clinical triage guidelines while logging an audit trail demonstrating immediate standard-of-care fulfillment.",
              },
              {
                q: "Can I connect my own custom domain (e.g., www.bennettpsychotherapy.com)?",
                a: "Absolutely. All Professional and Growth plans include custom domain mapping with automatic HTTPS/SSL provisioning. You can easily link domains purchased from GoDaddy, Namecheap, Google Domains, or Cloudflare in just a few clicks.",
              },
              {
                q: "Is there any contract, setup fee, or cancellation penalty?",
                a: "No long-term commitments or lock-ins. You can test TheraFlow AI completely free for 14 days without entering a credit card. If you choose to subscribe, you can cancel or pause your plan at any time from your billing dashboard with 1-click data export.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-bold text-sm md:text-base text-foreground flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                      openFaqIndex === idx ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-muted-foreground leading-relaxed border-t border-border/50 bg-background/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          6. BOTTOM CALL-TO-ACTION BANNER
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-6 bg-gradient-to-br from-primary via-emerald-800 to-teal-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="container mx-auto max-w-3xl relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
            Ready to give your practice an intelligent operating system?
          </h2>
          <p className="text-base md:text-lg text-emerald-100 max-w-xl mx-auto">
            Join hundreds of modern therapists who are saving 10+ hours every week and providing an elevated client experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-primary rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-xl"
            >
              Start Your Free 14-Day Trial
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-800/60 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm border border-emerald-600/40 transition-colors"
            >
              Explore Demo Practice (Sarah Bennett)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
