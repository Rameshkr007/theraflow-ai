"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// DEMO DATA — "Willow & Mind Therapy" — Austin, TX (fictional)
// All data is fictional and for demonstration purposes only.
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_PRACTICE = {
  name: "Willow & Mind Therapy",
  tagline: "Compassionate support for life's most challenging moments",
  location: "Austin, Texas",
  type: "Individual Practice",
  services: [
    { name: "Anxiety Support", duration: 50, price: 150, icon: "🌊" },
    { name: "Burnout Counseling", duration: 50, price: 150, icon: "🔥" },
    { name: "Couples Therapy", duration: 80, price: 200, icon: "💚" },
    { name: "Life Transitions", duration: 50, price: 150, icon: "🦋" },
  ],
  stats: {
    totalSessions: 1247,
    activeClients: 34,
    websiteVisitors: 2340,
    bookingConversion: "7.2%",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ARCHITECTURE DIAGRAM DATA
// ─────────────────────────────────────────────────────────────────────────────

const ARCHITECTURE_LAYERS = [
  {
    id: "visitor",
    label: "Public Visitors",
    description: "Therapy seekers discovering the practice",
    icon: "👥",
    color: "bg-info/10 border-info/30 text-info",
    responsibilities: ["Browse practice website", "Chat with AI assistant", "Book appointments", "Submit inquiries"],
  },
  {
    id: "nextjs",
    label: "Next.js 14 (App Router)",
    description: "Universal rendering layer",
    icon: "⚡",
    color: "bg-primary/10 border-primary/30 text-primary",
    responsibilities: [
      "Server-side rendering for SEO",
      "Client components for interactivity",
      "API routes for backend logic",
      "Edge middleware for auth & routing",
      "Static generation for public pages",
    ],
  },
  {
    id: "api",
    label: "API Gateway Layer",
    description: "Security & observability at every request",
    icon: "🛡️",
    color: "bg-secondary/10 border-secondary/30 text-secondary",
    responsibilities: [
      "JWT authentication validation",
      "Multi-tenant isolation",
      "Role-based authorization",
      "Rate limiting (per endpoint category)",
      "Request ID injection",
      "Audit logging",
      "Security headers (CSP, HSTS)",
    ],
  },
  {
    id: "services",
    label: "Application Services",
    description: "Domain-specific business logic",
    icon: "⚙️",
    color: "bg-surface-subtle border-border",
    responsibilities: [
      "Practice Management Service",
      "Website & CMS Service",
      "Booking Service (with idempotency)",
      "Inquiry CRM Service",
      "Analytics Service (privacy-first)",
      "SEO Intelligence Service",
      "Automation Engine",
      "Notification Service",
    ],
  },
  {
    id: "ai",
    label: "AI Gateway",
    description: "Provider-agnostic AI orchestration",
    icon: "🤖",
    color: "bg-warning/10 border-warning/30 text-warning-700",
    responsibilities: [
      "Provider abstraction (OpenAI/Anthropic)",
      "Automatic fallback on failure",
      "Multi-agent orchestration",
      "Tool calling with human-in-the-loop",
      "Prompt registry & versioning",
      "Cost tracking & rate limiting",
      "Content safety guard",
      "RAG pipeline (pgvector)",
    ],
  },
  {
    id: "data",
    label: "Data Layer",
    description: "PostgreSQL + Prisma with pgvector",
    icon: "🗄️",
    color: "bg-success/10 border-success/30 text-success",
    responsibilities: [
      "Multi-tenant PostgreSQL",
      "Prisma ORM with type safety",
      "pgvector for AI embeddings",
      "Connection pooling",
      "Immutable audit logs",
      "Content versioning",
      "File storage (local/S3/R2)",
    ],
  },
];

const AGENTS = [
  { name: "Orchestrator", description: "Coordinates complex multi-step tasks", icon: "🎯", color: "bg-primary" },
  { name: "Content Agent", description: "Generates and improves website copy", icon: "✍️", color: "bg-secondary" },
  { name: "SEO Agent", description: "Analyzes and optimizes search visibility", icon: "🔍", color: "bg-info" },
  { name: "UX Agent", description: "Reviews experience and conversion", icon: "🎨", color: "bg-warning" },
  { name: "Analytics Agent", description: "Interprets performance data", icon: "📊", color: "bg-success" },
  { name: "Support Agent", description: "Answers visitor questions via RAG", icon: "💬", color: "bg-primary" },
  { name: "QA Agent", description: "Validates website health and links", icon: "✅", color: "bg-secondary" },
  { name: "Compliance Guard", description: "Flags potentially risky content", icon: "🛡️", color: "bg-error" },
];

const ADRS = [
  {
    id: "ADR-001",
    title: "PostgreSQL as primary database",
    decision: "Use PostgreSQL with Prisma ORM",
    context: "Needed ACID transactions for booking/billing, JSON support for flexible content, and vector search for RAG.",
    alternatives: ["MongoDB (rejected: inconsistent relations)", "MySQL (rejected: weaker JSON/vector support)", "SQLite (rejected: not production-grade for SaaS)"],
    consequences: ["Full ACID compliance for financial operations", "pgvector extension for AI embeddings without separate vector DB", "Strong typing via Prisma", "Requires a PostgreSQL provider (Neon, Supabase, Railway)"],
  },
  {
    id: "ADR-002",
    title: "AI provider abstraction layer",
    decision: "Build a provider-agnostic AI gateway",
    context: "AI providers change pricing, availability, and capabilities frequently. Vendor lock-in is a critical risk for a product where AI is central.",
    alternatives: ["Direct OpenAI calls (rejected: vendor lock-in)", "LangChain (rejected: over-abstraction, complex)"],
    consequences: ["Can switch between OpenAI/Anthropic without code changes", "Automatic fallback when a provider is unavailable", "Cost optimization through model routing", "Slight additional complexity in the gateway"],
  },
  {
    id: "ADR-003",
    title: "Row-level multi-tenancy via tenantId",
    decision: "Single database, tenant isolation at application layer",
    context: "Therapy practice data requires strict isolation. Evaluated database-per-tenant (too expensive), schema-per-tenant (complex migrations), and row-level (pragmatic, scalable to ~1000 tenants).",
    alternatives: ["Database per tenant (rejected: cost + operational overhead)", "Schema per tenant (rejected: migration complexity)"],
    consequences: ["All queries must include tenantId - enforced in middleware", "Risk of data leak if tenantId check is omitted - mitigated by service layer", "Simple migrations and backups", "Cost-effective"],
  },
  {
    id: "ADR-004",
    title: "Human-in-the-loop for all AI writes",
    decision: "AI can read data freely but all writes require human approval",
    context: "Therapy practices deal with sensitive clinical adjacent content. AI mistakes on public-facing content could damage practice reputation or client trust.",
    alternatives: ["Fully autonomous AI (rejected: too risky for healthcare-adjacent context)", "AI writes with undo (rejected: undo isn't sufficient for published content)"],
    consequences: ["Zero risk of accidental AI-driven data corruption", "Slightly slower workflow for AI-assisted tasks", "Full audit trail of every AI decision", "Users maintain control and trust the system more"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ShowcasePage() {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [activeAdr, setActiveAdr] = useState<string | null>(null);

  const selectedLayerData = ARCHITECTURE_LAYERS.find((l) => l.id === selectedLayer);

  return (
    <div className="min-h-screen bg-surface">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="bg-primary-dark text-white py-16 px-8">
        <div className="max-w-content mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <span>🌿</span>
            <span>Portfolio Showcase — Technical Interview Edition</span>
          </div>
          <h1 className="text-5xl font-serif font-bold mb-4">TheraFlow AI</h1>
          <p className="text-xl text-white/80 max-w-2xl mb-8">
            An AI-Native Digital Operating System for Modern Therapy Practices.
            This showcase explains the architecture, engineering decisions, and
            product thinking behind the platform.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Next.js 14", "PostgreSQL + pgvector", "Multi-tenant", "AI Agents", "RAG", "TypeScript"].map((tag) => (
              <span key={tag} className="bg-white/15 rounded-full px-3 py-1 text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-8 py-16 space-y-24">
        {/* ── PROBLEM & PRODUCT ──────────────────────────────────────────────── */}
        <section>
          <h2 className="text-3xl font-serif font-bold text-text-primary mb-4">
            The Problem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-error/5 border border-error/20 rounded-xl p-6">
              <h3 className="font-semibold text-error mb-4 text-lg">Before TheraFlow</h3>
              <ul className="space-y-2 text-text-secondary">
                {[
                  "Therapists cobble together WordPress + Calendly + Google Forms",
                  "Zero understanding of how clients discover and evaluate them",
                  "AI-powered search (ChatGPT, Perplexity) can't surface their practice",
                  "No system to convert website visitors into booked clients",
                  "Manual follow-up with every inquiry",
                  "No way to understand what's working on their website",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-error mt-0.5">✗</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-success/5 border border-success/20 rounded-xl p-6">
              <h3 className="font-semibold text-success mb-4 text-lg">With TheraFlow</h3>
              <ul className="space-y-2 text-text-secondary">
                {[
                  "One intelligent system managing the entire digital presence",
                  "AI-powered website generation from practice data",
                  "GEO/AEO optimization for AI search engine visibility",
                  "Conversion intelligence showing exactly where clients drop off",
                  "Automated follow-up workflows with human oversight",
                  "Continuous improvement loop: analytics → AI → approval → improvement",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-success mt-0.5">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── DEMO PRACTICE ──────────────────────────────────────────────────── */}
        <section>
          <div className="inline-flex items-center gap-2 bg-warning/10 text-warning border border-warning/20 rounded-full px-4 py-1.5 text-sm mb-6">
            📊 DEMO DATA — All data below is fictional for demonstration
          </div>
          <h2 className="text-3xl font-serif font-bold text-text-primary mb-8">
            Demo Practice: {DEMO_PRACTICE.name}
          </h2>
          <div className="bg-surface-raised border border-border rounded-xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(DEMO_PRACTICE.stats).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{value}</div>
                  <div className="text-sm text-text-muted capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ARCHITECTURE VISUALIZER ────────────────────────────────────────── */}
        <section>
          <h2 className="text-3xl font-serif font-bold text-text-primary mb-4">
            System Architecture
          </h2>
          <p className="text-text-secondary mb-8">
            Click any layer to explore its responsibilities.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Diagram */}
            <div className="space-y-2">
              {ARCHITECTURE_LAYERS.map((layer) => (
                <motion.button
                  key={layer.id}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedLayer === layer.id
                      ? layer.color + " shadow-md"
                      : "bg-surface-raised border-border hover:border-border-strong"
                  }`}
                  onClick={() => setSelectedLayer(selectedLayer === layer.id ? null : layer.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{layer.icon}</span>
                    <div>
                      <div className="font-semibold text-text-primary">{layer.label}</div>
                      <div className="text-sm text-text-muted">{layer.description}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="bg-surface-raised border border-border rounded-xl p-6 sticky top-8 h-fit">
              {selectedLayerData ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{selectedLayerData.icon}</span>
                    <h3 className="text-xl font-semibold">{selectedLayerData.label}</h3>
                  </div>
                  <p className="text-text-muted mb-4">{selectedLayerData.description}</p>
                  <h4 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
                    Responsibilities
                  </h4>
                  <ul className="space-y-2">
                    {selectedLayerData.responsibilities.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-primary mt-0.5">→</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <div className="text-center text-text-muted py-12">
                  <div className="text-4xl mb-3">🏗️</div>
                  <div>Click a layer to explore its responsibilities</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── AI AGENT ARCHITECTURE ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-3xl font-serif font-bold text-text-primary mb-4">
            Multi-Agent AI Architecture
          </h2>
          <p className="text-text-secondary mb-3">
            TheraFlow uses specialized agents for different tasks, orchestrated by a central coordinator.
          </p>
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4 mb-8 text-sm text-warning-700">
            <strong>Design principle:</strong> Agents use deterministic tools for data access.
            All write operations require explicit human approval. Agents cannot modify production data autonomously.
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {AGENTS.map((agent) => (
              <div key={agent.name} className="bg-surface-raised border border-border rounded-xl p-4 text-center">
                <div className={`w-10 h-10 rounded-full ${agent.color} text-white flex items-center justify-center text-lg mx-auto mb-3`}>
                  {agent.icon}
                </div>
                <div className="font-semibold text-sm text-text-primary mb-1">{agent.name}</div>
                <div className="text-xs text-text-muted">{agent.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECURITY MODEL ─────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-3xl font-serif font-bold text-text-primary mb-8">
            Security Architecture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔒",
                title: "Tenant Isolation",
                points: [
                  "Every DB table has tenantId",
                  "All queries scoped at service layer",
                  "Middleware validates tenant match",
                  "Cross-tenant access: impossible by design",
                ],
              },
              {
                icon: "🛡️",
                title: "AI Safety",
                points: [
                  "Prompt injection detection",
                  "Strict message boundary separation",
                  "Content safety guard on all AI output",
                  "Human approval for all AI writes",
                ],
              },
              {
                icon: "📋",
                title: "Audit & Compliance",
                points: [
                  "Immutable audit log for all actions",
                  "Session management with revocation",
                  "API keys: hashed, prefix-only display",
                  "Privacy-first analytics",
                ],
              },
            ].map((section) => (
              <div key={section.title} className="bg-surface-raised border border-border rounded-xl p-6">
                <div className="text-3xl mb-3">{section.icon}</div>
                <h3 className="font-semibold text-text-primary mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-success mt-0.5">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── ARCHITECTURE DECISION RECORDS ──────────────────────────────────── */}
        <section>
          <h2 className="text-3xl font-serif font-bold text-text-primary mb-4">
            Architecture Decision Records
          </h2>
          <p className="text-text-secondary mb-8">
            Every major architectural decision is documented with context, alternatives considered, and trade-offs accepted.
          </p>
          <div className="space-y-4">
            {ADRS.map((adr) => (
              <div key={adr.id} className="bg-surface-raised border border-border rounded-xl overflow-hidden">
                <button
                  className="w-full text-left p-6 flex items-center justify-between"
                  onClick={() => setActiveAdr(activeAdr === adr.id ? null : adr.id)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-text-muted">{adr.id}</span>
                    <span className="font-semibold text-text-primary">{adr.title}</span>
                  </div>
                  <span className="text-text-muted">{activeAdr === adr.id ? "−" : "+"}</span>
                </button>
                {activeAdr === adr.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-6 pb-6 border-t border-border"
                  >
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-2">Decision</h4>
                        <p className="text-text-secondary text-sm">{adr.decision}</p>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-2 mt-4">Context</h4>
                        <p className="text-text-secondary text-sm">{adr.context}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-2">Alternatives Considered</h4>
                        <ul className="space-y-1">
                          {adr.alternatives.map((alt) => (
                            <li key={alt} className="text-sm text-text-secondary flex items-start gap-2">
                              <span className="text-error mt-0.5">✗</span>{alt}
                            </li>
                          ))}
                        </ul>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-2 mt-4">Consequences</h4>
                        <ul className="space-y-1">
                          {adr.consequences.map((c) => (
                            <li key={c} className="text-sm text-text-secondary flex items-start gap-2">
                              <span className="text-info mt-0.5">→</span>{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
        <div className="border-t border-border pt-12 text-center text-text-muted text-sm">
          <p>TheraFlow AI — Built as a portfolio demonstration of production-grade SaaS engineering.</p>
          <p className="mt-1">All demo data is fictional. Willow & Mind Therapy does not exist.</p>
        </div>
      </div>
    </div>
  );
}
