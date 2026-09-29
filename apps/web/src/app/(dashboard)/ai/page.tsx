'use client';

import React, { useState } from 'react';
import { AiActionsPanel } from '@/components/ai/AiActionsPanel';
import { Button } from '@/components/ui/button';

export default function AiCopilotPage() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hello! I am your TheraFlow AI Copilot. How can I help you manage your practice today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedCommands = [
    'What are my bookings this week?',
    'Show pages with weak SEO',
    'Why might bookings have decreased?',
    'Create a new service page'
  ];

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = { role: 'user', content: input };
    setMessages([...messages, newMsg]);
    setInput('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newMsg] })
      });
      const data = await res.json();
      setMessages(prev => [...prev, data.message]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="w-64 border-r bg-white p-4 hidden md:block">
        <h2 className="font-semibold text-sm text-gray-500 mb-4">Conversation History</h2>
        {/* History list mock */}
        <div className="text-sm text-gray-700 truncate cursor-pointer hover:bg-gray-100 p-2 rounded">
          Previous chat 1
        </div>
      </div>
      
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-lg ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border shadow-sm'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border shadow-sm p-3 rounded-lg animate-pulse flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2 mb-2 flex-wrap">
            {suggestedCommands.map((cmd) => (
              <button key={cmd} onClick={() => setInput(cmd)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                {cmd}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend() }}
              className="flex-1 border rounded-md p-2 resize-none"
              placeholder="Ask AI Copilot... (CMD+Enter to send)"
              rows={2}
            />
            <Button onClick={handleSend} disabled={loading || !input.trim()}>Send</Button>
          </div>
        </div>
      </div>
      
      <div className="w-80 border-l bg-white hidden lg:block">
        <AiActionsPanel />
      </div>
    </div>
  );
}
