"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { Loader2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!res || res.error) {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setValue('email', 'sarah@willowmindtherapy.com');
    setValue('password', 'Demo2024!');
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        email: 'sarah@willowmindtherapy.com',
        password: 'Demo2024!',
        redirect: false,
      });

      if (!res || res.error) {
        setError('Demo login failed. Please ensure the database is seeded.');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Failed to log in with demo account.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground mt-2">Sign in to your TheraFlow account</p>
      </div>

      {/* 1-Click Demo Login Banner */}
      <div className="mb-6 p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="w-4 h-4" />
          <span>Quick Demo Access</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Log into <strong>Willow & Mind Therapy</strong> with pre-populated practice data, active bookings, intake forms, and AI agents.
        </p>
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>1-Click Sign In as Dr. Sarah Bennett</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 my-4">
        <div className="h-px bg-border flex-1" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">or sign in with email</span>
        <div className="h-px bg-border flex-1" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            {error}
          </div>
        )}
        
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
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Password</label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
          </div>
          <input 
            {...register('password')}
            type="password"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 text-sm shadow-sm"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-border flex flex-col gap-3 text-center text-sm">
        <p className="text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Register now
          </Link>
        </p>
        <p className="text-muted-foreground">
          Want to create a new practice from scratch?{' '}
          <Link href="/onboarding" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
            Open Onboarding Wizard <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
