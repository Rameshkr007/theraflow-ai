'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Leaf, Menu, X } from 'lucide-react';
import { cn } from '@lib/utils';

export default function MarketingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Product', href: '#product' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Showcase', href: '/showcase' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header className={cn(
      'fixed top-0 w-full z-50 transition-all duration-300 bg-background/80 backdrop-blur-md',
      isScrolled ? 'border-b border-border shadow-sm py-3' : 'py-5'
    )}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Leaf className="w-8 h-8" />
          <span className="font-serif font-bold text-xl text-foreground">TheraFlow</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
            Start Free Trial
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-foreground" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border p-4 shadow-lg flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-base font-medium py-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <Link href="/login" className="w-full text-center py-2 text-sm font-medium border border-input rounded-md">
              Sign In
            </Link>
            <Link href="/register" className="w-full text-center py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md">
              Start Free Trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
