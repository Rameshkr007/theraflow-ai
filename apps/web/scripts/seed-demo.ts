/**
 * Demo Data Seeder — Willow & Mind Therapy
 *
 * Creates a complete fictional practice for demonstration purposes.
 * Run with: npx ts-node --project tsconfig.json scripts/seed-demo.ts
 *
 * ALL DATA IS FICTIONAL. For demonstration only.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const { hash } = bcrypt;

const db = new PrismaClient();

async function seedDemo() {
  console.log("🌱 Seeding Willow & Mind Therapy demo data...");

  // ── Create subscription plans ────────────────────────────────────────────
  await db.$transaction([
    db.subscriptionPlan.upsert({
      where: { slug: "starter" },
      update: {},
      create: {
        name: "Starter",
        slug: "starter",
        price: 0,
        currency: "USD",
        interval: "month",
        features: {
          websites: 1,
          teamMembers: 2,
          aiRequestsPerMonth: 100,
          analyticsRetentionDays: 30,
          automations: 3,
          integrations: 2,
          storageGb: 1,
          canUseAiCopilot: true,
        },
      },
    }),
    db.subscriptionPlan.upsert({
      where: { slug: "professional" },
      update: {},
      create: {
        name: "Professional",
        slug: "professional",
        price: 79,
        currency: "USD",
        interval: "month",
        features: {
          websites: 1,
          teamMembers: 5,
          aiRequestsPerMonth: 500,
          analyticsRetentionDays: 90,
          automations: 10,
          integrations: 10,
          storageGb: 10,
          canUseAiCopilot: true,
          canUseAdvancedAnalytics: true,
          canUseExperiments: true,
          canUseAutomation: true,
          canUseCustomDomain: true,
        },
      },
    }),
    db.subscriptionPlan.upsert({
      where: { slug: "growth" },
      update: {},
      create: {
        name: "Growth",
        slug: "growth",
        price: 149,
        currency: "USD",
        interval: "month",
        features: {
          websites: 3,
          teamMembers: 15,
          aiRequestsPerMonth: 2000,
          analyticsRetentionDays: 180,
          automations: 50,
          integrations: 25,
          storageGb: 50,
          canUseAiCopilot: true,
          canUseAdvancedAnalytics: true,
          canUseExperiments: true,
          canUseAutomation: true,
          canUseDeveloperApi: true,
          canUseCustomDomain: true,
        },
      },
    }),
  ]);

  // ── Create demo tenant ────────────────────────────────────────────────────
  const tenant = await db.tenant.upsert({
    where: { slug: "willow-mind-demo" },
    update: {},
    create: {
      name: "Willow & Mind Therapy",
      slug: "willow-mind-demo",
      status: "ACTIVE",
      planId: "professional",
    },
  });

  // ── Create demo admin user ────────────────────────────────────────────────
  const adminPassword = await hash("Demo2024!", 12);
  const adminUser = await db.user.upsert({
    where: { email: "sarah@willowmindtherapy.com" },
    update: {},
    create: {
      name: "Dr. Sarah Willow",
      email: "sarah@willowmindtherapy.com",
      passwordHash: adminPassword,
      timezone: "America/Chicago",
      memberships: {
        create: {
          tenantId: tenant.id,
          role: "OWNER",
          inviteStatus: "ACCEPTED",
          joinedAt: new Date(),
        },
      },
    },
  });

  console.log(`  ✓ Demo user created: ${adminUser.email} (password: Demo2024!)`);

  // ── Create practice ───────────────────────────────────────────────────────
  const practice = await db.practice.upsert({
    where: { slug: "willow-mind-therapy" },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "Willow & Mind Therapy",
      slug: "willow-mind-therapy",
      type: "INDIVIDUAL",
      status: "ACTIVE",
      tagline: "Compassionate support for life's most challenging moments",
      description: "Willow & Mind Therapy offers a warm, evidence-based approach to mental health. Dr. Sarah Willow specializes in anxiety, burnout, couples therapy, and life transitions. Located in Austin, TX, with telehealth available across Texas.",
      phone: "(512) 555-0142",
      email: "hello@willowmindtherapy.com",
      address: {
        street: "2801 South Lamar Blvd, Suite 204",
        city: "Austin",
        state: "TX",
        zip: "78704",
        country: "US",
        lat: 30.2469,
        lng: -97.7706,
      },
      timezone: "America/Chicago",
      operatingHours: {
        monday: { open: "09:00", close: "18:00" },
        tuesday: { open: "09:00", close: "18:00" },
        wednesday: { open: "09:00", close: "18:00" },
        thursday: { open: "09:00", close: "18:00" },
        friday: { open: "09:00", close: "17:00" },
        saturday: null,
        sunday: null,
      },
      seoTitle: "Willow & Mind Therapy | Anxiety, Burnout & Couples Therapy | Austin, TX",
      seoDescription: "Compassionate therapy for anxiety, burnout, couples, and life transitions in Austin, TX. Dr. Sarah Willow offers evidence-based care. Book a free consultation.",
      socialLinks: {
        instagram: "https://instagram.com/willowmindtherapy",
        linkedin: "https://linkedin.com/in/dr-sarah-willow",
      },
      onboardingCompleted: true,
    },
  });

  // ── Create services ───────────────────────────────────────────────────────
  const services = [
    {
      name: "Anxiety Support",
      slug: "anxiety-support",
      type: "INDIVIDUAL" as const,
      description: "Evidence-based anxiety treatment using CBT and mindfulness. Whether you're dealing with generalized anxiety, panic attacks, social anxiety, or health anxiety, we'll develop personalized strategies to help you reclaim your peace.",
      shortDescription: "Evidence-based support for anxiety, worry, and panic.",
      category: "Individual Therapy",
      duration: 50,
      price: 150,
      displayOrder: 1,
      seoTitle: "Anxiety Therapy in Austin, TX | Willow & Mind",
      seoDescription: "Evidence-based anxiety treatment with Dr. Sarah Willow in Austin, TX. CBT, mindfulness, and personalized strategies for lasting relief.",
    },
    {
      name: "Burnout Counseling",
      slug: "burnout-counseling",
      type: "INDIVIDUAL" as const,
      description: "Specialized support for high-achievers experiencing burnout. We'll explore the root causes, rebuild sustainable routines, and rediscover what energizes you. You don't have to keep running on empty.",
      shortDescription: "Reclaim your energy and rediscover what matters.",
      category: "Individual Therapy",
      duration: 50,
      price: 150,
      displayOrder: 2,
      seoTitle: "Burnout Therapy Austin TX | Willow & Mind Therapy",
      seoDescription: "Therapist specializing in burnout recovery for high-achievers in Austin, TX. Rebuild your energy and rediscover balance.",
    },
    {
      name: "Couples Therapy",
      slug: "couples-therapy",
      type: "INDIVIDUAL" as const,
      description: "Strengthen your relationship with evidence-based couples therapy. Using the Gottman Method and Emotionally Focused Therapy, we'll work on communication, trust, and building a deeper connection.",
      shortDescription: "Strengthen connection and communication as a couple.",
      category: "Couples",
      duration: 80,
      price: 200,
      displayOrder: 3,
      seoTitle: "Couples Therapy Austin TX | Willow & Mind",
      seoDescription: "Gottman Method couples therapy in Austin, TX. Improve communication, rebuild trust, and strengthen your relationship.",
    },
    {
      name: "Life Transitions",
      slug: "life-transitions",
      type: "INDIVIDUAL" as const,
      description: "Support through major life changes: career shifts, relationship changes, loss, relocation, or any period of significant uncertainty. Find your footing and move forward with clarity.",
      shortDescription: "Navigate change with support and clarity.",
      category: "Individual Therapy",
      duration: 50,
      price: 150,
      displayOrder: 4,
      seoTitle: "Life Transitions Therapy Austin | Willow & Mind",
      seoDescription: "Therapy for major life changes in Austin, TX. Career shifts, loss, relationships — find clarity and move forward.",
    },
  ];

  for (const service of services) {
    await db.service.upsert({
      where: { practiceId_slug: { practiceId: practice.id, slug: service.slug } },
      update: {},
      create: { tenantId: tenant.id, practiceId: practice.id, ...service },
    });
  }

  // ── Create website ────────────────────────────────────────────────────────
  const website = await db.website.upsert({
    where: { subdomain: "willow-mind" },
    update: {},
    create: {
      tenantId: tenant.id,
      practiceId: practice.id,
      status: "PUBLISHED",
      subdomain: "willow-mind",
      currentVersion: 3,
      publishedVersion: 3,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      settings: {
        cookieBanner: true,
        analyticsEnabled: true,
        privacySettings: { anonymizeIps: true, retentionDays: 90 },
      },
    },
  });

  // ── Create demo bookings ──────────────────────────────────────────────────
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const demoBookings = [
    { clientName: "Emily Rodriguez", clientEmail: "emily.r@example.com", status: "CONFIRMED", hoursOffset: 24 },
    { clientName: "Michael Chen", clientEmail: "m.chen@example.com", status: "CONFIRMED", hoursOffset: 26 },
    { clientName: "Aisha Patel", clientEmail: "aisha.p@example.com", status: "PENDING", hoursOffset: 48 },
    { clientName: "Jordan Lee", clientEmail: "jordan.l@example.com", status: "COMPLETED", hoursOffset: -48 },
    { clientName: "Sofia Martinez", clientEmail: "sofia.m@example.com", status: "COMPLETED", hoursOffset: -72 },
  ];

  for (const b of demoBookings) {
    const startTime = new Date(Date.now() + b.hoursOffset * 60 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 50 * 60 * 1000);
    await db.booking.create({
      data: {
        tenantId: tenant.id,
        practiceId: practice.id,
        clientName: b.clientName,
        clientEmail: b.clientEmail,
        startTime,
        endTime,
        timezone: "America/Chicago",
        status: b.status as never,
        idempotencyKey: `demo-${b.clientEmail}-${Date.now()}`,
      },
    });
  }

  // ── Create demo inquiries ─────────────────────────────────────────────────
  await db.inquiry.createMany({
    data: [
      {
        tenantId: tenant.id,
        practiceId: practice.id,
        name: "Alex Thompson",
        email: "alex.t@example.com",
        subject: "Inquiry about anxiety therapy",
        message: "Hi, I've been struggling with anxiety for a few months now and am looking for support. Do you have availability for new clients? I work remotely so telehealth would be ideal.",
        status: "NEW",
        intent: "BOOKING",
        source: "WEBSITE",
      },
      {
        tenantId: tenant.id,
        practiceId: practice.id,
        name: "Priya Sharma",
        email: "priya.s@example.com",
        subject: "Couples therapy question",
        message: "My partner and I are interested in couples therapy. We've been together for 5 years and are going through a rough patch. Do you offer a free consultation call?",
        status: "READ",
        intent: "BOOKING",
        source: "WEBSITE",
      },
    ],
    skipDuplicates: true,
  });

  // ── Create demo knowledge items ───────────────────────────────────────────
  await db.knowledgeItem.createMany({
    data: [
      {
        tenantId: tenant.id,
        practiceId: practice.id,
        type: "FAQ",
        source: "MANUAL",
        title: "Do you accept insurance?",
        content: "Willow & Mind Therapy is a private-pay practice and does not bill insurance directly. However, we can provide a Superbill (a detailed receipt) that you can submit to your insurance for possible out-of-network reimbursement. Many clients recover 40-80% of session fees this way.",
        status: "APPROVED",
        version: 1,
      },
      {
        tenantId: tenant.id,
        practiceId: practice.id,
        type: "POLICY",
        source: "MANUAL",
        title: "Cancellation Policy",
        content: "We require 48 hours notice for cancellations or rescheduling. Late cancellations or no-shows will be charged the full session fee. We understand life happens - please reach out as soon as possible if you need to reschedule.",
        status: "APPROVED",
        version: 1,
      },
      {
        tenantId: tenant.id,
        practiceId: practice.id,
        type: "GENERAL",
        source: "MANUAL",
        title: "Session fees",
        content: "Individual therapy sessions (50 min): $150. Couples therapy sessions (80 min): $200. A free 15-minute phone consultation is available before your first session. Sliding scale may be available for those experiencing financial hardship - please inquire.",
        status: "APPROVED",
        version: 1,
      },
    ],
    skipDuplicates: true,
  });

  // ── Create demo testimonials ──────────────────────────────────────────────
  await db.testimonial.createMany({
    data: [
      {
        tenantId: tenant.id,
        practiceId: practice.id,
        authorName: "J.M.",
        authorTitle: "Software Engineer",
        content: "Working with Dr. Willow has been transformative. She helped me understand the root of my burnout and gave me practical tools to rebuild a life I actually enjoy. I came in exhausted and overwhelmed. Six months later, I feel like myself again.",
        rating: 5,
        source: "MANUAL",
        status: "PUBLISHED",
        consentGiven: true,
        publishedAt: new Date(),
      },
      {
        tenantId: tenant.id,
        practiceId: practice.id,
        authorName: "A.K. & R.K.",
        authorTitle: "Married couple",
        content: "We started couples therapy feeling like we'd lost each other somewhere along the way. Dr. Willow created a space where we both felt heard. We're not perfect, but we're communicating again and we remember why we chose each other.",
        rating: 5,
        source: "MANUAL",
        status: "PUBLISHED",
        consentGiven: true,
        publishedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  // ── Seed prompt versions ──────────────────────────────────────────────────
  await db.promptVersion.upsert({
    where: { key_version: { key: "visitor-assistant", version: 1 } },
    update: {},
    create: {
      key: "visitor-assistant",
      name: "Visitor Assistant v1",
      description: "Public-facing assistant for therapy practice websites",
      promptTemplate: "Answer visitor questions about the practice using only approved knowledge.",
      systemPrompt: "You are a helpful assistant for {{practiceName}}. Only use information from the provided knowledge base.",
      model: "gpt-4o-mini",
      provider: "openai",
      version: 1,
      status: "ACTIVE",
      evaluationScore: 87.5,
    },
  });

  // ── Seed clinical documentation (SOAP Note) ──────────────────────────────
  const existingNote = await db.clinicalNote.findFirst({
    where: { tenantId: tenant.id },
  });

  let clinicalNote = existingNote;
  if (!clinicalNote) {
    clinicalNote = await db.clinicalNote.create({
      data: {
        tenantId: tenant.id,
        clientName: "Elena Rodriguez",
        clientEmail: "elena.r@example.com",
        sessionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        durationMinutes: 50,
        noteType: "SOAP",
        subjective:
          "Client presented on time via telehealth for session #4. Reports reduced panic attack frequency (down from 4/week to 1 this past week). Describes lingering anticipatory anxiety surrounding work presentations. Stated: 'I practiced the 4-7-8 breathing exercise before my Monday meeting and avoided having a full panic attack.' Sleep quality improved to 6.5 hours/night.",
        objective:
          "Client was alert, oriented x4, dressed casually with good eye contact. Speech was fluent with normal rate and volume. Affect was congruent with mood, mildly anxious when discussing professional performance but demonstrably calmer than intake session. No psychomotor agitation or retardation observed.",
        assessment:
          "32-year-old female presenting with Generalized Anxiety Disorder with panic features (ICD-10 F41.1). Demonstrating good engagement with cognitive restructuring and diaphragmatic breathing tools. Beck Anxiety Inventory score decreased from 28 (moderate-severe) to 19 (mild-moderate). Clinical progress is positive.",
        plan:
          "1. Continue weekly 50-minute CBT sessions.\n2. Homework: Complete 3 thought records identifying catastrophizing cognitive distortions around upcoming quarterly review.\n3. Continue twice-daily diaphragmatic breathing.\n4. Follow-up scheduled for next Tuesday at 2:00 PM.",
        mentalStatusExam: {
          appearance: "Appropriately groomed, casual attire",
          mood: "Mildly anxious, hopeful",
          affect: "Congruent, responsive",
          thoughtProcess: "Logical, goal-directed, no loose associations",
          cognition: "Intact memory and concentration",
        },
        diagnosisCodes: ["F41.1", "F43.22"],
        procedureCodes: ["90834"],
        riskLevel: "LOW",
        homeworkAssigned: "CBT Thought Record (3 entries) + 4-7-8 breathing twice daily",
        clinicalImpression: "Positive response to initial CBT phase; high insight and compliance.",
        phiRedacted: true,
        aiGenerated: true,
        aiModelUsed: "gpt-4o-clinical-v2",
        isSigned: true,
        signedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000),
        signedById: adminUser.id,
        signatureText: "Dr. Sarah Bennett, PsyD, LPC #78291",
      },
    });
  }

  // ── Seed Superbill ────────────────────────────────────────────────────────
  const existingSuperbill = await db.superbill.findFirst({
    where: { tenantId: tenant.id },
  });

  if (!existingSuperbill) {
    await db.superbill.create({
      data: {
        tenantId: tenant.id,
        clinicalNoteId: clinicalNote?.id,
        invoiceNumber: "SB-2026-0089",
        clientName: "Elena Rodriguez",
        clientEmail: "elena.r@example.com",
        clientAddress: "1402 S Congress Ave, Austin, TX 78704",
        clientDob: "1994-06-15",
        providerName: "Dr. Sarah Bennett, PsyD",
        providerNpi: "1841920394",
        providerTaxId: "84-2910394",
        providerAddress: "1204 San Antonio St, Suite 200, Austin, TX 78701",
        serviceDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        procedureCode: "90834",
        procedureDescription: "Psychotherapy, 45-50 minutes, individual",
        diagnosisCode: "F41.1",
        secondaryDiagnosis: "F43.22",
        amount: 175.0,
        amountPaid: 175.0,
        status: "ISSUED",
        notes: "Paid in full via credit card. Standard CMS-1500 out-of-network claim receipt.",
        issuedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4000000),
      },
    });
  }

  // ── Seed Client Portal User ───────────────────────────────────────────────
  const existingPortalUser = await db.clientPortalUser.findFirst({
    where: { tenantId: tenant.id },
  });

  if (!existingPortalUser) {
    await db.clientPortalUser.create({
      data: {
        tenantId: tenant.id,
        name: "Elena Rodriguez",
        email: "elena.r@example.com",
        phone: "(512) 555-0194",
        passcodeHash: "$2a$12$eX8tA1sOmP7d3Q9yJ1K2L.abcdefghijklmnopqrstuvw",
        sessionToken: "demo-portal-token-elena",
        emergencyContact: {
          name: "Carlos Rodriguez",
          relationship: "Spouse",
          phone: "(512) 555-0199",
        },
        assignedHomework: [
          {
            id: "hw-1",
            title: "CBT Thought Record: Public Speaking",
            description: "Record trigger, automatic thought, cognitive distortion, and rational response.",
            completed: false,
            dueDate: "2026-10-04",
          },
          {
            id: "hw-2",
            title: "Daily 4-7-8 Breathing Log",
            description: "Practice diaphragmatic breathing for 5 minutes morning and evening.",
            completed: true,
            dueDate: "2026-09-29",
          },
        ],
        moodCheckIns: [
          { date: "2026-09-28", moodRating: 7, anxietyLevel: 4, note: "Calm morning, meeting went smoothly" },
          { date: "2026-09-29", moodRating: 6, anxietyLevel: 5, note: "Slight anxiety before client presentation" },
          { date: "2026-09-30", moodRating: 8, anxietyLevel: 3, note: "Felt confident and relaxed after exercise" },
        ],
      },
    });
  }

  // ── Seed Crisis Alert ─────────────────────────────────────────────────────
  const existingCrisis = await db.crisisAlert.findFirst({
    where: { tenantId: tenant.id },
  });

  if (!existingCrisis) {
    await db.crisisAlert.create({
      data: {
        tenantId: tenant.id,
        source: "INTAKE",
        severity: "MODERATE",
        clientName: "David Miller",
        clientContact: "david.m@example.com",
        contentSnippet: "Past history of severe passive suicidal ideation during depressive episodes; denies current intent or active plan.",
        detectedKeywords: ["suicidal ideation", "hopeless"],
        riskScore: 0.65,
        isResolved: true,
        resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        resolvedById: adminUser.id,
        actionTaken: "Reviewed safety contract during intake, identified emergency contact and provided 988 Lifeline wallet card.",
      },
    });
  }

  console.log("✅ Demo seed complete!");
  console.log("\n📋 Demo credentials:");
  console.log("   Email: sarah@willowmindtherapy.com");
  console.log("   Password: Demo2024!");
  console.log("\n🔗 Dashboard: http://localhost:3000/dashboard");
  console.log("🎭 Showcase: http://localhost:3000/showcase");
}

seedDemo()
  .catch(console.error)
  .finally(() => db.$disconnect());
