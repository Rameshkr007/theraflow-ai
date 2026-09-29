'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export function WebsiteCopilot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white z-50"
      >
        ✨
      </Button>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col border-l">
          <div className="p-4 border-b flex justify-between items-center bg-indigo-50">
            <h3 className="font-bold text-indigo-900">Website Copilot</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">×</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-sm text-gray-500 text-center mt-10">
              Start chatting to get suggestions on this page.
            </div>
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <div className="flex flex-wrap gap-2 mb-3">
              <button className="text-xs bg-white border px-2 py-1 rounded-full text-gray-600 hover:bg-gray-100">Improve this section</button>
              <button className="text-xs bg-white border px-2 py-1 rounded-full text-gray-600 hover:bg-gray-100">Check SEO</button>
              <button className="text-xs bg-white border px-2 py-1 rounded-full text-gray-600 hover:bg-gray-100">Shorter CTA</button>
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Ask copilot..." className="flex-1 border rounded p-2 text-sm" />
              <Button size="sm">→</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
