'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FunnelExplorer() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Conversion Funnel</CardTitle>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">DEMO DATA</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 text-center text-gray-500">100%</div>
              <div>
                <p className="font-semibold">Visitors</p>
                <p className="text-sm text-gray-500">10,000</p>
              </div>
            </div>
            <div className="text-sm font-medium text-green-600">Start</div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center space-x-4">
              <div className="w-12 text-center text-gray-500">63%</div>
              <div>
                <p className="font-semibold">Service views</p>
                <p className="text-sm text-gray-500">6,300</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">-37% drop-off</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-yellow-500 relative">
            <div className="absolute right-[-100px] top-1/2 -translate-y-1/2 bg-white border shadow-sm p-2 text-xs rounded">
              High drop-off here
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 text-center text-gray-500">33%</div>
              <div>
                <p className="font-semibold">Booking clicks</p>
                <p className="text-sm text-gray-500">2,100 (of prev)</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-500">-67% drop-off</span>
              <button className="text-xs text-blue-600 mt-1 hover:underline">Improve this step with AI</button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center space-x-4">
              <div className="w-12 text-center text-gray-500">50%</div>
              <div>
                <p className="font-semibold">Booking starts</p>
                <p className="text-sm text-gray-500">1,050 (of prev)</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">-50% drop-off</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center space-x-4">
              <div className="w-12 text-center text-gray-500">69%</div>
              <div>
                <p className="font-semibold">Completed bookings</p>
                <p className="text-sm text-gray-500">720 (of prev)</p>
              </div>
            </div>
            <div className="text-sm font-medium text-green-600">Conversion</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
