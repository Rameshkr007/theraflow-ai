'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AiActionDetailPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState('PENDING');

  const handleApprove = async () => {
    // Mock approve API call
    setStatus('APPROVED');
  };

  const handleReject = async () => {
    // Mock reject API call
    setStatus('REJECTED');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4 text-sm text-gray-500">
        <a href="/ai" className="hover:underline">&larr; Back to Copilot</a>
      </div>
      
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Review AI Action</h1>
            <div className="text-sm text-blue-600 font-semibold mt-1">UPDATE_PAGE</div>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
            {status}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">AI Plan & Reasoning</h2>
          <p className="text-gray-700 text-sm">
            I analyzed the "About Us" page and noticed the SEO description was missing. 
            I propose updating it to improve search engine visibility for couples therapy keywords.
          </p>
        </div>

        <div className="mb-8 border rounded overflow-hidden">
          <div className="bg-gray-100 p-2 text-sm font-semibold border-b">Content Diff (Before vs After)</div>
          <div className="flex text-sm">
            <div className="w-1/2 p-4 border-r bg-red-50 text-red-900">
              <pre>- meta description: ""</pre>
            </div>
            <div className="w-1/2 p-4 bg-green-50 text-green-900">
              <pre>+ meta description: "Expert couples therapy in Demo City. Book a session today to improve your relationship."</pre>
            </div>
          </div>
        </div>

        {status === 'PENDING' && (
          <div className="flex gap-4 border-t pt-4">
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">Approve & Execute</Button>
            <Button onClick={handleReject} variant="destructive">Reject</Button>
          </div>
        )}
      </div>
    </div>
  );
}
