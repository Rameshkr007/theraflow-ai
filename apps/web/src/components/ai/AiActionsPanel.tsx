'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export function AiActionsPanel() {
  const pendingActions = [
    { id: '1', type: 'UPDATE_PAGE', summary: 'Update SEO meta tags for Home page' },
    { id: '2', type: 'CREATE_PAGE', summary: 'Create new "Couples Therapy" service page' }
  ];

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="font-semibold text-lg border-b pb-2 mb-4">Pending AI Actions</h2>
      
      {pendingActions.length === 0 ? (
        <div className="text-gray-500 text-sm text-center mt-10">No pending AI actions</div>
      ) : (
        <div className="space-y-4 overflow-y-auto">
          {pendingActions.map(action => (
            <div key={action.id} className="border rounded-lg p-3 shadow-sm bg-gray-50">
              <div className="text-xs font-bold text-blue-600 mb-1">{action.type}</div>
              <div className="text-sm text-gray-800 mb-3">{action.summary}</div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full text-xs">Approve</Button>
                <Button size="sm" variant="outline" className="w-full text-xs text-red-600">Reject</Button>
              </div>
              <a href={`/ai/actions/${action.id}`} className="block text-center text-xs text-blue-500 mt-2 hover:underline">View details</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
