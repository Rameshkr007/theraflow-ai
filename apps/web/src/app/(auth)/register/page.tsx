"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { Loader2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms of service' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password') || '';
  
  const getStrength = (pass: string = '') => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getStrength(password);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          password: data.password,
          acceptedTerms: true,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        if (resData.error?.fields?.email) {
          setServerError(resData.error.fields.email[0]);
        } else {
          setServerError(resData.error?.message || 'Registration failed. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      // Auto sign in after registration
      const loginRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (loginRes?.error) {
        router.push('/login');
      } else {
        router.push('/onboarding');
      }
      router.refresh();
    } catch {
      setServerError('An error occurred during account creation. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Create an account</h1>
        <p className="text-muted-foreground mt-2">Start your 14-day free trial. No credit card required.</p>
      </div>

      {/* 1-Click Demo Shortcut */}
      <div className="mb-6 p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Already have demo data?</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">Explore pre-configured practice</p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap shadow-sm"
        >
          <span>Demo Login</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {serverError && (
        <div className="p-3 mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <input 
            {...register('fullName')}
            type="text" 
            placeholder="Dr. Jane Doe"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input 
            {...register('email')}
            type="email" 
            placeholder="you@practice.com"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Password</label>
          <input 
            {...register('password')}
            type="password"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          {password.length > 0 && (
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
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-start gap-2 pt-2">
          <input 
            {...register('acceptTerms')}
            type="checkbox" 
            className="mt-1 w-4 h-4 text-primary border-input rounded"
          />
          <label className="text-xs text-muted-foreground leading-normal">
            I accept the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </label>
        </div>
        {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>}

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 mt-4 text-sm shadow-sm"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account & Start Onboarding'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Log in</Link>
      </p>
    </div>
  );
}
