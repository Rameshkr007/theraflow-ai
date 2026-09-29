import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    practiceType: '',
    practiceName: '',
    tagline: '',
    services: [] as string[],
    targetAudience: '',
    location: { city: '', state: '' },
    brandStyle: '',
    toneWords: [] as string[],
    bookingPreference: '',
    policies: {}
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, 10));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    try {
      await fetch('/api/ai/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ practice: formData })
      });
      router.push('/onboarding/preview');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    'Practice Type', 'Practice Name', 'Services', 'Target Audience', 'Location',
    'Brand Style', 'Logo & Images', 'Booking', 'Policies', 'Generate'
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Step {step} of 10: {steps[step - 1]}</span>
          <span>{Math.round((step / 10) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">What type of practice do you run?</h2>
                <div className="space-y-3">
                  {['Individual Practice (solo therapist)', 'Group Practice (multiple therapists)', 'Clinic (multi-specialty, staff)', 'Telehealth Only'].map(type => (
                    <button
                      key={type}
                      className={`w-full text-left p-4 rounded-lg border ${formData.practiceType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setFormData({ ...formData, practiceType: type })}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">What is your practice called?</h2>
                <p className="text-gray-500 mb-6">This will be used in your website and branding</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Practice Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={formData.practiceName}
                      onChange={e => setFormData({ ...formData, practiceName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tagline (optional)</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={formData.tagline}
                      onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for steps 3-9 for brevity */}
            {step > 2 && step < 10 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">{steps[step-1]}</h2>
                <p className="text-gray-500 mb-6">Complete your practice details...</p>
                {/* Inputs would go here */}
              </div>
            )}

            {step === 10 && (
              <div className="text-center py-8">
                <h2 className="text-3xl font-bold mb-4">Ready to generate your website?</h2>
                <p className="text-gray-500 mb-8">We will use AI to craft your initial draft based on your answers.</p>
                <button
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate My Website'}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={step === 1 || isGenerating}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Back
        </button>
        {step < 10 && (
          <button
            onClick={nextStep}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
