"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

interface ResetPasswordClientProps {
  readonly token: string;
}

export default function ResetPasswordClient({ token }: ResetPasswordClientProps) {
  const base_url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (!token) {
      toast.error("Invalid token context or token has expired.");
      router.push('/auth/login');
    }
  }, [router, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return
    }

    
    const updatePromise = axios.post(`${base_url}/auth/reset-password`, {
      token: token,
      newPassword: password,
    });

    console.log(updatePromise)

    toast.promise(updatePromise, {
      loading: 'Updating password securely...',
      success: () => {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
        return 'Password changed successfully! Redirecting...';
      },
      error: (err: any) => {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to reset password.';
        setError(errorMessage);
        return `Error: ${errorMessage}`;
      },
    });

    try {
      await updatePromise;
    } catch (err) {
      console.error('Password persistence error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center px-4">
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/50">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl shadow-md mb-3">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">New Password</h1>
            <p className="text-slate-500 text-xs mt-1">
              Please choose a strong, new password below.
            </p>
          </div>

          {isSuccess ? (
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Security Updated</h3>
              <p className="text-xs text-slate-500">Your password was altered safely. Sending you back to login credentials screen...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Input 1: New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">New Password</label>
                <div className="relative">
                  <Input
                    className="h-10 pl-9 pr-10 text-sm border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg bg-white/50"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Input 2: Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Input
                    className="h-10 pl-9 text-sm border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg bg-white/50"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                </div>
                {error && (
                  <p className="text-[10px] text-rose-500 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle size={10} />
                    {error}
                  </p>
                )}
              </div>

              {/* Confirm Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 mt-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 font-bold text-sm rounded-lg shadow-md transition-all disabled:opacity-50"
              >
                {isLoading ? "Saving changes..." : "Reset Password"}
              </Button>

              {/* Back to Login Link */}
              <div className="text-center mt-2">
                <Link 
                  href="/auth/login" 
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  <ArrowLeft size={12} />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}