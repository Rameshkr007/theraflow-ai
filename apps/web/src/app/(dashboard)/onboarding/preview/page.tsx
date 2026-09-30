"use client";

import React, { useState } from 'react';

export default function WebsitePreview() {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const widthMap = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-6">Website Preview</h2>
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded border">
            <h3 className="font-medium text-sm">Hero Section</h3>
            <div className="flex gap-2 mt-2">
              <button className="text-xs text-blue-600">Edit</button>
              <button className="text-xs text-purple-600">AI Regenerate</button>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded border">
            <h3 className="font-medium text-sm">Services Section</h3>
            <div className="flex gap-2 mt-2">
              <button className="text-xs text-blue-600">Edit</button>
              <button className="text-xs text-purple-600">AI Regenerate</button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t space-y-3">
          <button className="w-full py-2 bg-gray-900 text-white rounded">Accept & Continue</button>
          <button className="w-full py-2 border rounded">Discard Draft</button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="h-14 bg-white border-b flex items-center justify-center gap-4">
          <button 
            className={`px-3 py-1 rounded ${device === 'desktop' ? 'bg-gray-200' : ''}`}
            onClick={() => setDevice('desktop')}
          >
            Desktop
          </button>
          <button 
            className={`px-3 py-1 rounded ${device === 'tablet' ? 'bg-gray-200' : ''}`}
            onClick={() => setDevice('tablet')}
          >
            Tablet
          </button>
          <button 
            className={`px-3 py-1 rounded ${device === 'mobile' ? 'bg-gray-200' : ''}`}
            onClick={() => setDevice('mobile')}
          >
            Mobile
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-8">
          <div 
            className="bg-white shadow-xl transition-all duration-300 rounded-lg overflow-hidden border border-gray-200 min-h-[800px]"
            style={{ width: widthMap[device] }}
          >
            <div className="p-8 text-center border-b">
              <h1 className="text-4xl font-bold mb-4">Generated Practice Name</h1>
              <p className="text-xl text-gray-500">Tagline goes here</p>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Services</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded">Service 1</div>
                <div className="p-4 bg-gray-50 rounded">Service 2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
