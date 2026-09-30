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
  PhoneCall,
  Clock,
  Download,
  Copy,
} from "lucide-react";

export default function MarketingPage() {
  const [activeHeroTab, setActiveHeroTab] = useState<"scribe" | "superbill" | "crisis" | "portal">("scribe");
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Ambient Glows & Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#2D6A4F_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] dark:opacity-[0.08] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-primary/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-[800px] right-[-200px] w-[600px] h-[600px] bg-purple-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* ──────────────────────────────────────────────────────────────────────────
          1. HERO SECTION WITH DYNAMIC INTERACTIVE SIMULATOR
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-4 md:px-6">
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          {/* Beacon Announcement Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold backdrop-blur-md hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 shadow-xs mb-8 group cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span>Next-Gen Therapy OS 2.0 Live</span>
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

          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" /> HIPAA Safe Harbor</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-primary" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> Instant 14-day access</span>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────────────────
            HERO INTERACTIVE PRODUCT SUITE SIMULATOR
        ────────────────────────────────────────────────────────────────────────── */}
        <div className="container mx-auto mt-16 max-w-5xl">
          <div className="rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden hover:border-primary/40 transition-all duration-300">
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
                      PHI Redacted
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
      <section className="py-12 border-y border-border bg-card/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">↓ 88%</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Note Documentation Time</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-serif font-bold text-emerald-600">60%–80%</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Patient Claim Return (Superbills)</p>
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
                className="group p-6 rounded-2xl border border-border bg-card/60 hover:bg-card hover:border-primary/40 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
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
          4. HOW IT WORKS TIMELINE
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-muted/30 px-4 md:px-6 border-t border-border">
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
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-all space-y-3"
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
          5. PRICING TEASER
      ────────────────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 md:px-6">
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
                features: ["AI Website Builder", "Client Appointment Booking", "Inquiry CRM", "50 AI Clinical Notes/mo", "Community Support"],
                popular: false,
              },
              {
                name: "Professional",
                price: billingInterval === "month" ? 99 : 79,
                desc: "Most popular for established individual practices.",
                features: ["Unlimited AI SOAP Scribe", "CMS-1500 Superbill Engine", "WebRTC Telehealth Room", "Dedicated Client Portal", "988 Crisis Guard", "Priority Support"],
                popular: true,
              },
              {
                name: "Growth & Group",
                price: billingInterval === "month" ? 179 : 149,
                desc: "For multi-provider group practices & clinics.",
                features: ["Up to 10 Clinicians (RBAC)", "Custom Domain & White-label", "Multi-provider Scheduling", "Full Developer REST API", "Dedicated Account Manager"],
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
