"use client";

import React from 'react';
import { FunnelExplorer } from '@/components/analytics/FunnelExplorer';
import { PrivacySettings } from '@/components/analytics/PrivacySettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select className="border rounded p-2">
            <option>Last 7d</option>
            <option>Last 30d</option>
            <option>Last 90d</option>
            <option>Custom</option>
          </select>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded">DEMO DATA</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Total Visitors</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">12,450 <span className="text-sm text-green-500 font-normal">+14%</span></p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Booking Conversions</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">720 <span className="text-sm text-gray-500 font-normal">(5.7%)</span></p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Avg. Session Duration</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">2m 45s</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Visitors Over Time</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 border border-dashed rounded text-gray-500">
              [Line Chart Placeholder - Recharts]
            </div>
          </CardContent>
        </Card>
        <FunnelExplorer />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Session Experience Map</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500 mb-4">Aggregate data only - no individual tracking</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Top scroll depth: 75%</span><span className="font-medium">45% of visitors</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Form abandon rate</span><span className="font-medium text-red-500">32%</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Primary CTA interaction</span><span className="font-medium text-green-500">18%</span></div>
            </div>
          </CardContent>
        </Card>
        <PrivacySettings />
      </div>
    </div>
  );
}
