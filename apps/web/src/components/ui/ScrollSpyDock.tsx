"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Layers, Sliders, CheckSquare, Star, Shield, CreditCard, HelpCircle, ArrowUp } from 'lucide-react';

interface Section {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: Section[] = [
  { id: 'hero', label: 'Top', icon: ArrowUp },
  { id: 'product', label: 'Features', icon: Sparkles },
  { id: 'ecosystem', label: 'Ecosystem', icon: Layers },
  { id: 'calculator', label: 'ROI Calc', icon: Sliders },
  { id: 'comparison', label: 'Matrix', icon: CheckSquare },
  { id: 'testimonials', label: 'Reviews', icon: Star },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'pricing', label: 'Pricing', icon: CreditCard },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
];

export default function ScrollSpyDock() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      setVisible(window.scrollY > 400);

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const sec = document.getElementById(SECTIONS[i].id);
        if (sec && sec.offsetTop <= scrollPosition) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Quick Page Navigation"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-1.5 p-1.5 rounded-2xl bg-card/85 backdrop-blur-xl border border-border/80 shadow-2xl shadow-primary/10 select-none animate-fade-in"
    >
      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        const Icon = sec.icon;

        return (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className={cn(
              "group relative flex items-center justify-center p-2 rounded-xl transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
            )}
            title={sec.label}
          >
            <Icon className="w-4 h-4" />

            {/* Floating Label Tooltip on Hover */}
            <span className="absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-card/95 text-foreground text-xs font-semibold whitespace-nowrap shadow-xl border border-border opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
              {sec.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
