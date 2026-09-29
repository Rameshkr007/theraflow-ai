import React from 'react';
import MarketingHeader from '@components/layouts/MarketingHeader';
import MarketingFooter from '@components/layouts/MarketingFooter';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
