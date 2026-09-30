"use client";

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PrivacySettings() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [cookieConsent, setCookieConsent] = useState(true);
  const [retention, setRetention] = useState('90');
  const [ipCollection, setIpCollection] = useState(false);
  const [geoTracking, setGeoTracking] = useState(false);

  const handleSave = async () => {
    console.log('Saving settings...', {
      analyticsEnabled, cookieConsent, retention, ipCollection, geoTracking
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Configure how visitor data is collected and stored.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Enable Analytics</h4>
            <p className="text-sm text-gray-500">Collect anonymous usage data to improve patient experience.</p>
          </div>
          <input type="checkbox" checked={analyticsEnabled} onChange={(e) => setAnalyticsEnabled(e.target.checked)} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Cookie Consent Banner</h4>
            <p className="text-sm text-gray-500">Show a banner to visitors to opt-in to tracking.</p>
          </div>
          <input type="checkbox" checked={cookieConsent} onChange={(e) => setCookieConsent(e.target.checked)} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Data Retention</h4>
            <p className="text-sm text-gray-500">How long to keep analytics data.</p>
          </div>
          <select value={retention} onChange={(e) => setRetention(e.target.value)} className="border rounded p-1">
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
            <option value="180">180 days</option>
            <option value="365">365 days</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">IP Address Collection</h4>
            <p className="text-sm text-gray-500">Collect IP addresses (Off by default for privacy).</p>
          </div>
          <input type="checkbox" checked={ipCollection} onChange={(e) => setIpCollection(e.target.checked)} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Geo-location Tracking</h4>
            <p className="text-sm text-gray-500">Track coarse location of visitors.</p>
          </div>
          <input type="checkbox" checked={geoTracking} onChange={(e) => setGeoTracking(e.target.checked)} />
        </div>

        <Button onClick={handleSave}>Save Settings</Button>
      </CardContent>
    </Card>
  );
}
