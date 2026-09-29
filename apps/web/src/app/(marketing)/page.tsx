import React from 'react';
import Link from 'next/link';
import { Play, Sparkles, Calendar, MessageSquare, Brain, Search, BarChart3, ArrowRight } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-6 overflow-hidden">
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Native Practice Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-foreground mb-6">
            Your practice, <br className="hidden md:block" /> intelligently managed
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            TheraFlow replaces 5 different tools with one seamless, AI-powered platform designed specifically for modern therapy practices.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Start for free
            </Link>
            <Link href="#demo" className="w-full sm:w-auto px-8 py-3.5 bg-background border border-input text-foreground rounded-lg font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              See how it works
            </Link>
          </div>
        </div>
        
        {/* Hero Dashboard Mockup */}
        <div className="container mx-auto mt-16 max-w-5xl">
          <div className="aspect-video bg-muted border border-border rounded-xl shadow-2xl overflow-hidden relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-primary/20" />
            <span className="text-muted-foreground font-medium text-lg relative z-10">Dashboard Mockup</span>
          </div>
        </div>
      </section>

      {/* 2. Social Proof */}
      <section className="py-12 border-y border-border bg-muted/50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
            Trusted by 500+ therapy practices
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale">
            {/* Mock logos text */}
            <div className="font-serif font-bold text-xl">MindfulCare</div>
            <div className="font-serif font-bold text-xl">Serenity</div>
            <div className="font-serif font-bold text-xl">OakTree Therapy</div>
            <div className="font-serif font-bold text-xl">Healing Path</div>
          </div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section className="py-24 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Everything you need to grow</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built from the ground up with AI to automate your administrative work and focus on client care.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'AI Website Builder', icon: Sparkles, desc: 'Generate a beautiful, SEO-optimized website in minutes.' },
              { title: 'Smart Booking', icon: Calendar, desc: 'Automated scheduling that syncs with your calendar.' },
              { title: 'Inquiry CRM', icon: MessageSquare, desc: 'Never miss a lead. Track all inquiries in one pipeline.' },
              { title: 'Practice Copilot', icon: Brain, desc: 'AI assistant for clinical notes and daily admin tasks.' },
              { title: 'SEO Intelligence', icon: Search, desc: 'Built-in tools to help you rank higher on Google.' },
              { title: 'Analytics & Insights', icon: BarChart3, desc: 'Understand your growth with clear, actionable data.' },
            ].map((feature, i) => (
              <div key={i} className="p-6 border border-border rounded-xl bg-background hover:shadow-lg transition-shadow">
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How it works */}
      <section className="py-24 bg-muted/30 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-16 text-center">How TheraFlow works</h2>
          <div className="space-y-12">
            {[
              { step: '01', title: 'Setup your practice profile', desc: 'Answer a few questions about your specialty and approach.' },
              { step: '02', title: 'AI generates your web presence', desc: 'Our engine builds your brand, website, and initial content.' },
              { step: '03', title: 'Connect your calendar', desc: 'Sync your schedule to enable smart, friction-free booking.' },
              { step: '04', title: 'Manage everything in one place', desc: 'Use the dashboard to track clients, notes, and growth.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Demo/Preview */}
      <section id="demo" className="py-24 px-4 md:px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">See TheraFlow in action</h2>
          <Link href="/showcase" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-lg">
            View interactive showcase <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 6. Pricing Teaser */}
      <section className="py-24 bg-muted/30 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">Simple, transparent pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Starter', 'Professional', 'Growth'].map((plan, i) => (
              <div key={i} className="p-8 border border-border rounded-xl bg-background flex flex-col">
                <h3 className="text-2xl font-bold mb-2">{plan}</h3>
                <p className="text-3xl font-serif font-bold mb-6">${(i+1)*29}<span className="text-sm text-muted-foreground font-sans font-normal">/mo</span></p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Core features
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Support
                  </li>
                </ul>
                <button className="w-full py-2 border border-primary text-primary rounded-md font-medium hover:bg-primary/10 transition-colors">
                  Choose {plan}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Banner */}
      <section className="py-24 px-4 md:px-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-center">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white">Ready to transform your practice?</h2>
          <p className="text-xl mb-10 text-primary-foreground/90">
            Join hundreds of therapists who are reclaiming their time and growing their impact.
          </p>
          <Link href="/register" className="inline-block px-8 py-4 bg-background text-foreground rounded-lg font-bold text-lg hover:bg-muted transition-colors shadow-lg">
            Start your 14-day free trial
          </Link>
        </div>
      </section>
    </div>
  );
}
