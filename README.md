# TheraFlow AI

**AI-Native Digital Operating System for Modern Therapy Practices**

> Transform "I need a website" into "I have an intelligent system managing my online practice."

---

## What is TheraFlow AI?

TheraFlow AI is a production-grade SaaS platform that helps therapy practices build, operate, understand, and continuously improve their digital presence. It combines a website builder, CMS, booking system, AI assistant, practice analytics, SEO intelligence, and automation into one cohesive system.

### The Client Lifecycle

```
DISCOVER → UNDERSTAND → TRUST → ENGAGE → BOOK →
COMPLETE INTAKE → FOLLOW UP → UNDERSTAND PERFORMANCE → IMPROVE
```

Every feature maps to this lifecycle. Features that don't serve it don't get built.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict) |
| Database | PostgreSQL + Prisma ORM + pgvector |
| Auth | NextAuth.js v4 (JWT) |
| Validation | Zod |
| Styling | Tailwind CSS + CSS Design Tokens |
| State | Zustand + TanStack Query |
| AI | OpenAI / Anthropic (provider-abstracted gateway) |
| UI Primitives | Radix UI |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |

---

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL 15+ (or Neon/Supabase)
- OpenAI API key (optional — mock mode available)

---

## Quick Start

```bash
# 1. Clone and install
git clone <repo>
cd theraflow-ai
npm install --legacy-peer-deps

# 2. Configure environment
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your DATABASE_URL and NEXTAUTH_SECRET

# 3. Set up database
cd apps/web
npx prisma generate
npx prisma db push

# 4. Seed demo data (optional)
npx ts-node scripts/seed-demo.ts

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login** (after seeding):
- Email: `sarah@willowmindtherapy.com`
- Password: `Demo2024!`

---

## Environment Variables

Copy `apps/web/.env.example` to `apps/web/.env.local` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Min 32 chars, for JWT signing |
| `NEXTAUTH_URL` | ✅ | Your app URL |
| `OPENAI_API_KEY` | ⚠️ | Required for AI features (mock mode available) |
| `ANTHROPIC_API_KEY` | ❌ | Optional AI fallback provider |
| `AI_PROVIDER` | ❌ | `openai` \| `anthropic` \| `mock` (default: `openai`) |
| `STORAGE_PROVIDER` | ❌ | `local` \| `s3` \| `r2` (default: `local`) |
| `EMAIL_PROVIDER` | ❌ | `console` \| `smtp` \| `resend` (default: `console`) |
| `STRIPE_SECRET_KEY` | ❌ | For billing features |

> **AI without API keys**: Set `AI_PROVIDER=mock` to run the full app without an OpenAI key. AI responses will be clearly labeled as mock.

---

## Project Structure

```
theraflow-ai/
├── apps/
│   └── web/                    # Next.js 14 application
│       ├── src/
│       │   ├── app/            # App Router routes
│       │   ├── components/     # React components
│       │   │   ├── ui/         # Design system (29 components)
│       │   │   ├── layouts/    # Layout components
│       │   │   ├── ai/         # AI-specific components
│       │   │   └── analytics/  # Analytics visualizations
│       │   ├── lib/            # Core utilities
│       │   │   ├── ai/         # AI gateway, tools, prompts
│       │   │   ├── auth.ts     # NextAuth config
│       │   │   ├── db.ts       # Prisma client
│       │   │   ├── env.ts      # Env validation
│       │   │   ├── audit.ts    # Audit logging
│       │   │   └── entitlements.ts # Plan entitlements
│       │   └── styles/         # Design tokens + globals
│       └── scripts/            # Seed scripts
└── packages/
    └── db/                     # Prisma schema
        └── prisma/
            └── schema.prisma   # Full 32-model schema
```

---

## Key Features

### 🤖 AI-Powered Website Generation
- 10-step onboarding wizard collects practice information
- AI generates complete website draft (homepage, services, about, FAQ, contact)
- All content starts as DRAFT — never published automatically
- Section-by-section editing with AI regeneration

### 🧠 Practice Copilot
- Floating AI assistant in the dashboard
- Calls deterministic tools instead of hallucinating state
- All AI write operations require explicit human approval
- Full audit trail of every AI decision

### 📊 Privacy-First Analytics
- Aggregate session analytics without individual tracking
- Conversion funnel visualization
- Configurable data retention, anonymization
- Demo data clearly labeled

### 🔍 SEO + GEO/AEO Intelligence
- Technical SEO audit across all pages
- GEO/AEO readiness for AI search engines
- Structured recommendations with AI-assisted fixes
- No false ranking promises

### 🔄 Visual Automation Engine
- Trigger → Condition → Action workflow builder
- Idempotency keys prevent duplicate executions
- Execution logs with retry tracking

### 🛡️ Multi-Tenant Security
- Row-level tenant isolation via `tenantId`
- JWT sessions with role-based access control
- Immutable audit logs
- Rate limiting per endpoint category

---

## Architecture Docs

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, tech choices, patterns |
| [DATABASE.md](docs/DATABASE.md) | Schema documentation |
| [AI.md](docs/AI.md) | AI architecture, agents, RAG, prompts |
| [SECURITY.md](docs/SECURITY.md) | Security model, auth, isolation |

**Showcase page**: Visit `/showcase` for an interactive architecture walkthrough designed for technical interviews.

---

## Demo

The demo practice **"Willow & Mind Therapy"** (Austin, TX) demonstrates all platform features with clearly labeled fictional data:

- Services: Anxiety Support, Burnout Counseling, Couples Therapy, Life Transitions
- Complete website with SEO metadata
- Bookings, inquiries, testimonials, knowledge base
- Demo analytics (clearly labeled as simulated)

---

## Engineering Notes

### Why Not Auto-Publish?
TheraFlow never automatically publishes AI-generated content. Every change goes through: Draft → Review → Approval → Publish. This is especially critical for therapy practices where incorrect clinical-adjacent content could harm client trust.

### Why Provider-Abstracted AI?
AI providers change pricing, models, and availability. Vendor lock-in is existential risk when AI is central to the product. The gateway supports automatic fallback from OpenAI → Anthropic → Mock without code changes.

### Why Row-Level Tenancy?
At therapy practice scale (~1-500 practices), row-level tenancy is pragmatic, cost-effective, and supports simple migrations. Database-per-tenant is operationally expensive; schema-per-tenant makes migrations complex. The tradeoff: all queries must include `tenantId`, enforced at the service layer.

---

## License

MIT — Built as a portfolio demonstration of production-grade SaaS engineering.

> All demo data is fictional. Willow & Mind Therapy does not exist.
