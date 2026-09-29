'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    // Mock login delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Mock error for demonstration
    // setError('Invalid email or password');
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Welcome back</h1>
        <p className="text-muted-foreground mt-2">Sign in to your TheraFlow account</p>
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
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex items-center justify-center py-2.5 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2">
        <div className="h-px bg-border flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="h-px bg-border flex-1" />
      </div>

      <div className="mt-6">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-background border border-input text-foreground rounded-md font-medium hover:bg-muted transition-colors opacity-70 cursor-not-allowed">
          {/* Mock Google Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google (Coming Soon)
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account? <Link href="/register" className="text-primary font-medium hover:underline">Register</Link>
      </p>
    </div>
  );
}
