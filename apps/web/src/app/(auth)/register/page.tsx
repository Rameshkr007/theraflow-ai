'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { cn } from '@lib/utils';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val, 'You must accept the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const password = watch('password');
  
  // Simple password strength indicator
  const getStrength = (pass: string = '') => {
    let score = 0;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const strength = getStrength(password);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    // Mock registration delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Create an account</h1>
        <p className="text-muted-foreground mt-2">Start your 14-day free trial. No credit card required.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <input 
            {...register('fullName')}
            type="text" 
            placeholder="Dr. Jane Doe"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input 
            {...register('email')}
            type="email" 
            placeholder="you@practice.com"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Password</label>
          <input 
            {...register('password')}
            type="password"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {/* Strength Indicator */}
          {password && password.length > 0 && (
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1 flex-1 rounded-full",
                    strength >= i 
                      ? strength < 2 ? "bg-destructive" : strength < 4 ? "bg-amber-500" : "bg-primary"
                      : "bg-muted"
                  )} 
                />
              ))}
            </div>
          )}
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Confirm Password</label>
          <input 
            {...register('confirmPassword')}
            type="password"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-start gap-2 pt-2">
          <input 
            {...register('acceptTerms')}
            type="checkbox" 
            className="mt-1 w-4 h-4 text-primary border-input rounded"
          />
          <label className="text-sm text-muted-foreground">
            I accept the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </label>
        </div>
        {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 mt-4"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link>
      </p>
    </div>
  );
}
