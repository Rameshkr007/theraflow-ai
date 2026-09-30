"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SeoIntelligenceCenter() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">SEO Intelligence Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader><CardTitle>Overall SEO Score</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center text-3xl font-bold text-green-600">
              84
            </div>
            <div className="mt-4 w-full space-y-2 text-sm">
              <div className="flex justify-between"><span>Technical</span><span>30/30</span></div>
              <div className="flex justify-between"><span>Content</span><span>25/30</span></div>
              <div className="flex justify-between"><span>Local</span><span>15/20</span></div>
              <div className="flex justify-between"><span>Schema</span><span>14/20</span></div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader><CardTitle>GEO/AEO Readiness</CardTitle><CardDescription>GEO/AEO scores estimate readiness for AI search engines, not guaranteed rankings.</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">Entity Clarity Score</span>
                <span className="text-green-600 font-semibold">High (92%)</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">Structured FAQ Presence</span>
                <span className="text-yellow-600 font-semibold">Partial</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">Organization Schema</span>
                <span className="text-green-600 font-semibold">Valid</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">Machine-readable Content</span>
                <span className="text-green-600 font-semibold">Optimized</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Issues & Recommendations</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b"><th className="pb-2">Issue</th><th className="pb-2">Page</th><th className="pb-2">Impact</th><th className="pb-2">Action</th></tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">Missing alt text on primary hero image</td>
                  <td className="py-3 text-gray-500">/services/couples-therapy</td>
                  <td className="py-3"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">High</span></td>
                  <td className="py-3"><Button variant="outline" size="sm">Fix with AI</Button></td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Meta description too short</td>
                  <td className="py-3 text-gray-500">/about</td>
                  <td className="py-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Medium</span></td>
                  <td className="py-3"><Button variant="outline" size="sm">Fix with AI</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Quick Wins</CardTitle></CardHeader>
        <CardContent>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">Add FAQ Schema to Services Pages</h4>
              <p className="text-sm text-gray-500">Effort: Low | Impact: High</p>
            </div>
            <Button>Apply with AI</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
