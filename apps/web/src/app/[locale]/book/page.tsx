'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function PublicBookingFlow() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 bg-white shadow-sm z-10 border-b">
        <div className="max-w-2xl mx-auto flex items-center p-4">
          <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all" 
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <span className="ml-4 text-sm font-semibold text-gray-600">Step {step} of 5</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 mt-8">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Select a Service</h2>
            <div className="space-y-4">
              <div 
                onClick={() => setStep(2)}
                className="bg-white p-6 rounded-xl shadow-sm border hover:border-indigo-600 cursor-pointer transition-colors min-h-[48px]"
              >
                <h3 className="font-bold text-lg">Initial Consultation</h3>
                <p className="text-gray-600 text-sm mt-1">15 min | Free</p>
                <p className="text-gray-500 mt-2 text-sm">A brief call to see if we are a good fit.</p>
              </div>
              <div 
                onClick={() => setStep(2)}
                className="bg-white p-6 rounded-xl shadow-sm border hover:border-indigo-600 cursor-pointer transition-colors min-h-[48px]"
              >
                <h3 className="font-bold text-lg">Individual Therapy</h3>
                <p className="text-gray-600 text-sm mt-1">50 min | $150</p>
                <p className="text-gray-500 mt-2 text-sm">Standard individual counseling session.</p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose a Date</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border min-h-[300px] flex items-center justify-center">
              <p className="text-gray-500">[ Calendar Picker Placeholder ]</p>
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Choose a Time</h2>
            <div className="grid grid-cols-2 gap-4">
              {['09:00 AM', '10:00 AM', '01:00 PM', '03:00 PM'].map(t => (
                <div key={t} onClick={() => setStep(4)} className="bg-white border rounded-lg p-4 text-center cursor-pointer hover:bg-indigo-50 min-h-[48px] flex items-center justify-center font-medium">
                  {t}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Details</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" className="w-full border rounded-lg p-3 min-h-[48px]" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full border rounded-lg p-3 min-h-[48px]" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea className="w-full border rounded-lg p-3" rows={3} placeholder="Anything I should know?" />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={() => setStep(5)} className="px-8">Confirm Booking</Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-8">You will receive an email confirmation shortly.</p>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border text-left max-w-sm mx-auto mb-8">
              <h3 className="font-bold mb-4">Initial Consultation</h3>
              <p className="text-sm text-gray-600 mb-2">🗓️ Friday, Oct 20, 2023</p>
              <p className="text-sm text-gray-600">⏰ 10:00 AM (Your Timezone)</p>
            </div>

            <Button className="w-full max-w-sm min-h-[48px]">Add to Calendar</Button>
          </div>
        )}
      </div>
    </div>
  );
}
