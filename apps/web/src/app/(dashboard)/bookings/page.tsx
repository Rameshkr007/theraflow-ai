"use client";

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export default function BookingsPage() {
  const mockBookings = [
    { id: 1, name: 'John Doe', service: 'Initial Consultation', date: '2023-10-15 10:00 AM', status: 'CONFIRMED' },
    { id: 2, name: 'Jane Smith', service: 'Couples Therapy', date: '2023-10-15 01:00 PM', status: 'PENDING' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Button>+ New Booking</Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-gray-500 text-sm">Today</div>
          <div className="text-2xl font-bold mt-1">4</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-gray-500 text-sm">This Week</div>
          <div className="text-2xl font-bold mt-1">18</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-gray-500 text-sm">Pending</div>
          <div className="text-2xl font-bold mt-1 text-yellow-600">3</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-gray-500 text-sm">Upcoming (7 days)</div>
          <div className="text-2xl font-bold mt-1">21</div>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-sm text-gray-600">
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Service</th>
              <th className="p-4 font-medium">Date & Time</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockBookings.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{b.name}</td>
                <td className="p-4 text-gray-600 text-sm">{b.service}</td>
                <td className="p-4 text-gray-600 text-sm">{b.date}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    b.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-4">
                  <Button variant="outline" size="sm">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
