import React from 'react';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Half - Branding / Testimonial (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-primary/10 to-primary/30 p-12 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-2 text-primary font-bold text-2xl">
          <Leaf className="w-8 h-8" />
          <span>TheraFlow AI</span>
        </div>
        
        <div className="relative z-10 max-w-md">
          <blockquote className="text-2xl font-serif text-foreground/90 leading-relaxed mb-6">
            "TheraFlow has completely transformed how I run my practice. The AI copilot handles my notes and scheduling so I can focus purely on my clients."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20" />
            <div>
              <p className="font-medium text-foreground">Dr. Sarah Jenkins</p>
              <p className="text-sm text-muted-foreground">Clinical Psychologist</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Half - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="flex lg:hidden items-center gap-2 text-primary font-bold text-2xl justify-center mb-8">
            <Leaf className="w-8 h-8" />
            <span>TheraFlow AI</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
