/**
 * Demo Data Seeder — Willow & Mind Therapy
 *
 * Creates a complete fictional practice for demonstration purposes.
 * Run with: npx ts-node --project tsconfig.json scripts/seed-demo.ts
 *
 * ALL DATA IS FICTIONAL. For demonstration only.
 */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

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
