"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Leaf, Twitter, Linkedin, CheckCircle2, Send, ShieldCheck, HeartHandshake, FileCheck } from 'lucide-react';

export default function MarketingFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-card border-t border-border py-14 md:py-20 relative overflow-hidden">
      {/* Subtle ambient glow in footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="container mx-auto px-4 md:px-6">
        {/* Top Newsletter & Live Status Bar */}
        <div className="pb-12 mb-12 border-b border-border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>All Systems Operational · 99.99% Uptime · HIPAA Certified</span>
            </div>
            <h3 className="font-serif font-bold text-xl md:text-2xl text-foreground">
              Stay ahead in modern digital mental health care.
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Join 4,200+ therapists receiving our weekly brief on clinical AI, CPT coding updates, and ethical practice growth.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-xs font-medium text-primary flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>You're subscribed! Check your inbox for the Clinical AI Practice Playbook.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your clinical or practice email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-input bg-background text-xs md:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary flex-1"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs md:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo & Tagline */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Leaf className="w-6 h-6" />
              <span className="font-serif font-bold text-xl text-foreground">TheraFlow AI</span>
            </Link>
            <p className="text-xs md:text-sm text-muted-foreground max-w-sm leading-relaxed">
              The complete AI-native digital operating system for private therapy practices, clinics, and mental health groups.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Clinical Suite</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/clinical/notes" className="hover:text-primary transition-colors">AI SOAP Scribe</Link></li>
              <li><Link href="/billing/superbills" className="hover:text-primary transition-colors">CMS-1500 Superbills</Link></li>
              <li><Link href="/crisis" className="hover:text-primary transition-colors">988 Crisis Guard</Link></li>
              <li><Link href="/telehealth/session-elena-01" className="hover:text-primary transition-colors">WebRTC Telehealth</Link></li>
              <li><Link href="/portal" className="hover:text-primary transition-colors">Patient Portal</Link></li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Practice Hub</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Practice Dashboard</Link></li>
              <li><Link href="/website/builder" className="hover:text-primary transition-colors">AI Website Composer</Link></li>
              <li><Link href="/onboarding" className="hover:text-primary transition-colors">10-Step Onboarding</Link></li>
              <li><Link href="/showcase" className="hover:text-primary transition-colors">Client Showcase</Link></li>
              <li><Link href="/settings/security" className="hover:text-primary transition-colors">Security & BAA</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">Compliance & Legal</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/settings/security" className="hover:text-primary transition-colors">HIPAA Safe Harbor</Link></li>
              <li><Link href="/settings/billing" className="hover:text-primary transition-colors">Pricing & Billing</Link></li>
              <li><Link href="/developer" className="hover:text-primary transition-colors">Developer REST API</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground leading-relaxed mb-8">
          <p>
            <strong>Clinical Disclaimer:</strong> TheraFlow AI is an administrative and clinical documentation assistance tool designed to support licensed mental health professionals. TheraFlow AI does not provide medical diagnoses or replace independent clinical judgment. Clinicians remain solely responsible for reviewing, editing, and signing all clinical records. If a client is experiencing an acute psychiatric emergency, please direct them immediately to the <strong>988 Suicide & Crisis Lifeline</strong> or 911.
          </p>
        </div>

        {/* Bottom Copyright & Trust Badges */}
        <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} TheraFlow AI, Inc. Built for clinicians with clinical-grade safety.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> HIPAA BAA Compliant</span>
            <span className="flex items-center gap-1"><FileCheck className="w-3.5 h-3.5 text-emerald-600" /> CMS-1500 Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
