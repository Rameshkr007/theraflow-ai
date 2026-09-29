'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function InquiriesPage() {
  const [selectedInquiry, setSelectedInquiry] = useState<number | null>(1);
  
  const inquiries = [
    { id: 1, name: 'Alice Walker', subject: 'Interested in couples therapy', status: 'UNREAD', intent: 'Booking' },
    { id: 2, name: 'Bob Smith', subject: 'Do you take insurance?', status: 'READ', intent: 'Information' }
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="p-6 border-b bg-white">
        <h1 className="text-2xl font-bold">Inquiries Inbox</h1>
        <div className="flex gap-4 mt-4">
          <button className="text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1">All</button>
          <button className="text-gray-500 hover:text-gray-800 pb-1">New</button>
          <button className="text-gray-500 hover:text-gray-800 pb-1">Replied</button>
          <button className="text-gray-500 hover:text-gray-800 pb-1">Archived</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* List Pane */}
        <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
          {inquiries.map(inq => (
            <div 
              key={inq.id} 
              onClick={() => setSelectedInquiry(inq.id)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${selectedInquiry === inq.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
            >
              <div className="flex justify-between mb-1">
                <span className={`font-medium ${inq.status === 'UNREAD' ? 'text-black font-bold' : 'text-gray-700'}`}>{inq.name}</span>
                <span className="text-xs text-gray-500">2h ago</span>
              </div>
              <div className="text-sm text-gray-800 truncate">{inq.subject}</div>
              <div className="mt-2 flex gap-2">
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">{inq.intent}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Pane */}
        <div className="flex-1 bg-white overflow-y-auto">
          {selectedInquiry ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Interested in couples therapy</h2>
                  <div className="text-gray-500 text-sm mt-1">From: Alice Walker &lt;alice@example.com&gt;</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Mark as Replied</Button>
                  <Button variant="outline" size="sm" className="text-red-600">Spam</Button>
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                <div className="text-xs font-bold text-indigo-800 mb-1">✨ AI Summary</div>
                <p className="text-sm text-indigo-900">
                  Client is seeking couples therapy and has availability on Tuesday evenings. They are asking about your sliding scale options.
                </p>
              </div>

              <div className="prose text-gray-800 max-w-none mb-8">
                Hi there,<br/><br/>
                My partner and I are looking to start couples therapy. We are mostly free on Tuesday evenings. Do you offer a sliding scale?<br/><br/>
                Thanks,<br/>
                Alice
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Quick Replies</h3>
                <div className="flex gap-2">
                  <Button variant="outline">Book a call</Button>
                  <Button variant="outline">Send info pack</Button>
                  <Button>Custom reply</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select an inquiry to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
