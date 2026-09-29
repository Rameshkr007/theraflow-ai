import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
// Assuming these are standard ui components that exist or will be created
import { TooltipProvider } from '@ui/tooltip';
import { Toaster } from '@ui/toaster';
import { cn } from '@lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const lora = Lora({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: {
    template: '%s | TheraFlow AI',
    default: 'TheraFlow AI - Your practice, intelligently managed',
  },
  description: 'AI-Native Practice Platform for therapists.',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable, lora.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
