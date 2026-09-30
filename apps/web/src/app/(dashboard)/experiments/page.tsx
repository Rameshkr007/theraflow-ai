"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ExperimentationCenter() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Experimentation Center</h1>
        <Button>Create Experiment</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Active Experiments</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b"><th className="pb-2">Name</th><th className="pb-2">Status</th><th className="pb-2">Primary Metric</th><th className="pb-2">Actions</th></tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 font-medium">Hero CTA Text A/B</td>
                  <td className="py-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Running</span></td>
                  <td className="py-3 text-gray-500">Booking Clicks</td>
                  <td className="py-3 space-x-2">
                    <Button variant="outline" size="sm">View Results</Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium">Pricing Page Layout</td>
                  <td className="py-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Insufficient Data</span></td>
                  <td className="py-3 text-gray-500">Conversion Rate</td>
                  <td className="py-3 space-x-2">
                    <Button variant="outline" size="sm">View Results</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Experiment Results: Hero CTA Text A/B</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded border border-yellow-200 text-sm">
            <strong>Note:</strong> Not enough data for statistical conclusions. Continue running.
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded">
              <h4 className="font-semibold text-gray-700">Variant A (Control)</h4>
              <p className="text-sm text-gray-500 mb-2">"Book Consultation"</p>
              <div className="text-2xl font-bold">3.2% <span className="text-sm font-normal text-gray-500">conversion</span></div>
              <p className="text-xs text-gray-400 mt-1">1,200 visitors</p>
            </div>
            <div className="p-4 border rounded border-blue-200 bg-blue-50">
              <h4 className="font-semibold text-blue-700">Variant B</h4>
              <p className="text-sm text-blue-500 mb-2">"Start Your Journey"</p>
              <div className="text-2xl font-bold text-blue-700">4.5% <span className="text-sm font-normal text-blue-500">conversion</span></div>
              <p className="text-xs text-blue-400 mt-1">1,180 visitors</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button disabled>Conclude & Apply Winner</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
