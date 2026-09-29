# TheraFlow AI — Architecture Documentation

## System Overview

TheraFlow AI is a multi-tenant SaaS platform built as a single Next.js 14 application with an App Router architecture. It serves multiple therapy practices (tenants) from a single codebase, isolating their data at the application layer via `tenantId` on every database operation.

## Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | Next.js | 14.x | SSR/SSG, API routes, App Router, edge middleware |
| Language | TypeScript | 5.x | Strict typing, developer productivity |
| Database | PostgreSQL + Prisma | 5.x | ACID transactions, pgvector, JSON support |
| Authentication | NextAuth.js | 4.x | Flexible, Next.js native, JWT sessions |
| Validation | Zod | 3.x | Runtime + compile-time schema validation |
| Styling | Tailwind CSS | 3.x | Design token integration, constraint-based |
| State Management | Zustand + TanStack Query | latest | Minimal global state + server state caching |
| AI | OpenAI / Anthropic (abstracted) | various | Provider flexibility |
| UI Primitives | Radix UI | latest | Accessible, unstyled, composable |
| Animation | Framer Motion | 10.x | Production-grade, accessible animations |
| Forms | React Hook Form + Zod | latest | Performant, type-safe |
| Tables | TanStack Table | 8.x | Headless, virtualized, fully typed |
| Drag & Drop | @dnd-kit | 6.x | Accessible drag-and-drop |

## Application Structure

```
apps/web/src/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public marketing pages (grouped route)
│   ├── (auth)/                   # Authentication pages
│   ├── (dashboard)/              # Authenticated dashboard
│   ├── showcase/                 # Technical portfolio showcase
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth + registration
│   │   ├── practices/            # Practice CRUD
│   │   ├── websites/             # Website management
│   │   ├── pages/                # Page CMS
│   │   ├── bookings/             # Booking system
│   │   ├── inquiries/            # Inquiry CRM
│   │   ├── contact/              # Public contact form
│   │   ├── ai/                   # AI endpoints (chat, generate, actions)
│   │   ├── analytics/            # Analytics collection + summary
│   │   ├── seo/                  # SEO audit
│   │   ├── onboarding/           # Onboarding state
│   │   └── v1/                   # Public developer API
│   └── [locale]/                 # Dynamic public practice sites
├── components/
│   ├── ui/                       # Design system components (29 components)
│   ├── layouts/                  # Page layouts (Marketing, Dashboard, Auth)
│   ├── ai/                       # AI-specific components
│   ├── analytics/                # Analytics visualizations
│   ├── website/                  # Website builder components
│   └── dashboard/                # Dashboard-specific components
├── lib/
│   ├── ai/                       # AI gateway, tools, prompts
│   │   ├── gateway.ts            # Provider abstraction with fallback
│   │   ├── tools.ts              # Agent tool system (read/write separation)
│   │   └── prompts.ts            # Prompt registry
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Prisma client singleton
│   ├── env.ts                    # Environment validation (Zod)
│   ├── api-response.ts           # Standardized response helpers
│   ├── audit.ts                  # Immutable audit logging
│   ├── logger.ts                 # Structured logger
│   ├── rate-limit.ts             # Rate limiting (in-memory / Redis)
│   ├── entitlements.ts           # Plan entitlement service
│   └── feature-flags.ts          # Feature flag system
├── hooks/                        # Custom React hooks
├── styles/
│   ├── tokens.css                # Design token system
│   └── globals.css               # Global styles
└── middleware.ts                 # Auth, security headers, rate limits
```

## Multi-Tenancy Architecture

### Isolation Model: Row-Level via `tenantId`

Every table in the database includes a `tenantId` column. Tenant isolation is enforced at the application service layer:

```typescript
// CORRECT - always scope to tenant
const pages = await db.page.findMany({
  where: { tenantId: ctx.tenantId, websiteId },
});

// NEVER do this - would leak cross-tenant data
const pages = await db.page.findMany({ where: { websiteId } });
```

The middleware validates that the JWT token's `tenantId` matches the requested resource's `tenantId` before any service call.

### Tenant Resolution

1. **Authenticated routes** (`/dashboard/*`): `tenantId` from JWT session
2. **Public practice sites** (`[domain]/*`): resolved from subdomain or custom domain against `Website.subdomain` / `Website.customDomain`

## AI Architecture

### Provider Abstraction

```
callAi(options)
  ├── Primary provider (env.AI_PROVIDER = "openai")
  │   └── callOpenAI() → AiResponse
  ├── Fallback provider (env.AI_FALLBACK_PROVIDER = "anthropic")
  │   └── callAnthropic() → AiResponse
  └── Mock provider (development only)
      └── callMock() → AiResponse
```

### Agent Tool System

Agents use deterministic tools to access data — they never hallucinate system state:

```
READ tools (no side effects):
  getPractice()        → practice profile
  getWebsite()         → website status
  getPages()           → page list + SEO status
  getAnalyticsSummary() → metrics summary
  getBookings()        → recent bookings
  getInquiries()       → recent inquiries
  getSiteHealth()      → SEO/health issues

WRITE tools (create pending AiAction requiring approval):
  createUpdatePageAction(pageId, proposedContent, reason) → actionId
  createNewPageAction(title, type, proposedContent, reason) → actionId
```

### Human-in-the-Loop Flow

```
AI request
    ↓
AI generates plan + preview
    ↓
AiAction created (status: PLANNED)
    ↓
User reviews before/after preview
    ↓
User approves/rejects
    ↓
If approved: action executed, AiAction status → COMPLETED
    ↓
Audit log created
```

### RAG Architecture (Knowledge Hub)

```
Document upload → Virus scan → Text extraction → Chunking
    → Embedding generation → pgvector storage
    
Query → Semantic search (pgvector) → Reranking → Context filter
    → AI prompt (with practice_knowledge block) → Safety guard → Response
```

### Prompt Injection Defense

The visitor assistant uses explicit message boundaries to prevent prompt injection:

```
<system_rules>
  [Instructions that cannot be overridden]
</system_rules>

<practice_knowledge>
  [Approved practice information]
</practice_knowledge>

<visitor_message>
  [Untrusted user input - treated as data only]
</visitor_message>
```

## Security Architecture

### Authentication Flow
1. User submits credentials → NextAuth `authorize` callback
2. Credentials validated against `bcrypt`-hashed password in DB
3. JWT signed with `NEXTAUTH_SECRET` (minimum 32 chars)
4. Session includes: `userId`, `tenantId`, `role`, `isSuperAdmin`
5. JWT verified in middleware for every protected route

### Authorization Layers
1. **Middleware** — validates auth exists for `/dashboard/*`
2. **API route handlers** — validate session, check `tenantId` match
3. **Service layer** — all DB queries include `tenantId` condition
4. **RBAC** — role checked before any privileged operation

### API Key Security
- Never stored in plaintext
- Stored as SHA-256 hash
- Only prefix (first 8 chars) displayed in UI
- Scoped: `website:read`, `bookings:read`, `inquiries:read`, `analytics:read`

### Content Security
- CSP header on all responses
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security` with preload
- Admin/dashboard routes: `X-Robots-Tag: noindex, nofollow`

## Database Design

See [DATABASE.md](./DATABASE.md) for schema documentation.

Key design decisions:
- **Soft deletes**: Important records use `status: ARCHIVED`
- **Immutable audit log**: `AuditLog` records never modified after creation
- **Versioned content**: `PageVersion` preserves content history
- **Idempotency**: Bookings, payments use idempotency keys
- **JSON flexibility**: Config, metadata, and structured content in JSON columns with TypeScript interfaces

## Performance Considerations

| Area | Approach |
|------|----------|
| API responses | Target < 200ms p50, < 1000ms p95 |
| Database | Compound indexes on all common query patterns |
| N+1 prevention | Prisma `include` / `select` with careful relation loading |
| Caching | TanStack Query for client-side caching |
| Images | Next.js Image optimization with responsive sizes |
| Code splitting | App Router automatic code splitting per route |
| Rate limiting | Per-category limits prevent abuse |

## Observability

- **Structured logging** via `logger.ts` — JSON in production, human-readable in dev
- **Request IDs** — injected by middleware, propagated through response headers
- **AI cost tracking** — tokens, cost estimate, model, provider logged per request
- **Audit logs** — immutable record of every important action
- **Error tracking** — errors logged with stack traces in development

## Deployment Architecture

```
Developer → Git → CI/CD Pipeline:
  Install → Lint → TypeCheck → Unit Tests → Build →
  Integration Tests → E2E Tests → Security Check → Deploy

Target infrastructure:
  - Vercel / Railway (Next.js app)
  - Neon / Supabase (PostgreSQL)
  - Cloudflare R2 (file storage)
  - Upstash Redis (rate limiting at scale)
  - Resend (transactional email)
  - Stripe (billing)
```

## Known Limitations (Honest Disclosure)

- **Rate limiting**: Currently in-memory; requires Redis for multi-instance production
- **File storage**: Local storage in development; S3/R2 adapter required for production
- **Email**: Console provider in development; SMTP/Resend required for production
- **AI vector search**: pgvector schema in place; embedding generation and search queries not yet wired
- **Custom domains**: Architecture defined; SSL provisioning requires Cloudflare/Let's Encrypt integration
- **Billing**: Stripe integration architecture defined; webhook handlers and subscription management require Stripe configuration
- **Analytics**: Privacy-first collection architecture in place; real-time aggregation requires background job processing

These are architectural boundaries, not missing design decisions. The scaffolding exists for each.
