import React from 'react';
import Link from 'next/link';
import { Leaf, Twitter, Linkedin } from 'lucide-react';

export default function MarketingFooter() {
  return (
    <footer className="bg-muted py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Logo & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Leaf className="w-6 h-6" />
              <span className="font-serif font-bold text-lg text-foreground">TheraFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The complete AI-native operating system for modern therapy practices. Manage less, care more.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Features</Link></li>
              <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="#" className="hover:text-foreground">Security</Link></li>
              <li><Link href="#" className="hover:text-foreground">Updates</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
              <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground">Help Center</Link></li>
              <li><Link href="#" className="hover:text-foreground">Community</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} TheraFlow AI Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
