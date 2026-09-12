"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, ShieldCheck, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ForgotClient() {
  const base_url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Step 1: Request OTP (/forgot-password)
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email) {
      setError('Please Email is Required !');
      setIsLoading(false);
      return;
    }

    const resetPromise = axios.post(`${base_url}/auth/forgot-password`, {
      email: email,
    });

    toast.promise(resetPromise, {
      loading: 'Sending recovery code...',
      success: (response) => {
        setStep('otp');
        return response.data?.message || 'Verification code has been sent to your email.';
      },
      error: (err: any) => {
        const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Something went wrong';
        setError(errorMessage);
        return `Error: ${errorMessage}`;
      },
    });

    try {
      await resetPromise;
    } catch (err) {
      console.error('Password reset failure context:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Validate OTP (/otp-validate)
  const handleValidateOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!otp) {
      setError('Please enter the OTP code!');
      setIsLoading(false);
      return;
    }

    const validatePromise = axios.post(`${base_url}/auth/otp-validate`, {
      email: email,
      otp: otp,
    });

    toast.promise(validatePromise, {
      loading: 'Validating OTP...',
      success: (response) => {
        setStep('reset'); // Move to password update form
        return response.data?.message || 'OTP verified successfully.';
      },
      error: (err: any) => {
        const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Invalid or expired OTP';
        setError(errorMessage);
        return `Error: ${errorMessage}`;
      },
    });

    try {
      await validatePromise;
    } catch (err) {
      console.error('OTP validation failure context:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Complete Password Reset (/reset-password)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!newPassword) {
      setError('New password is required!');
      setIsLoading(false);
      return;
    }

    const resetPasswordPromise = axios.post(`${base_url}/auth/reset-password`, {
      email: email,
      newPassword: newPassword,
    });

    toast.promise(resetPasswordPromise, {
      loading: 'Updating password...',
      success: (response) => {
        setTimeout(() => router.push('/auth/login'), 2000);
        return response.data?.message || 'Password successfully updated! Redirecting to login...';
      },
      error: (err: any) => {
        const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to update password';
        setError(errorMessage);
        return `Error: ${errorMessage}`;
      },
    });

    try {
      await resetPasswordPromise;
    } catch (err) {
      console.error('Password reset completion failure:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center px-4">
      
  

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/50">
          
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
          
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {step === 'email' && 'Reset Password'}
              {step === 'otp' && 'Verify OTP'}
              {step === 'reset' && 'New Password'}
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              {step === 'email' && 'Enter your email to receive reset instructions'}
              {step === 'otp' && `Enter the verification code sent to ${email}`}
              {step === 'reset' && 'Enter your secure new password'}
            </p>
          </motion.div>

          {/* Step 1: Request Email */}
          {step === 'email' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-1.5">
                
                <div className="relative">
                  <Input 
                    className="h-10 pl-9 text-sm border-slate-200 focus:border-emerald-500 rounded-lg bg-white/50"
                    type="email" 
                    placeholder="hello@jemigraph.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    required 
                    disabled={isLoading}
                  />
                  {/* <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} /> */}
                </div>
                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-rose-500 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle size={10} /> {error}
                  </motion.p>
                )}
              </div>
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-10 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 font-bold text-sm rounded-lg shadow-md text-white"
                >
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Validate OTP */}
          {step === 'otp' && (
            <form onSubmit={handleValidateOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider text-white">
                  Verification Code (OTP)
                </label>
                <Input 
                  className="h-10 text-sm tracking-widest text-center font-bold border-slate-200 focus:border-emerald-500 rounded-lg bg-white/50 "
                  type="text" 
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value); setError(''); }}
                  required 
                  disabled={isLoading}
                />
                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-rose-500 flex items-center gap-1 mt-1 font-medium text-white">
                    <AlertCircle size={10} /> {error}
                  </motion.p>
                )}
              </div>
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-10 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 font-bold text-sm rounded-lg shadow-md text-white"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Update New Password */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  New Password
                </label>
                <Input 
                  className="h-10 text-sm border-slate-200 focus:border-emerald-500 rounded-lg bg-white/50"
                  type="password" 
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  required 
                  disabled={isLoading}
                />
                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-rose-500 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle size={10} /> {error}
                  </motion.p>
                )}
              </div>
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-10 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 font-bold text-sm rounded-lg shadow-md text-white"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          )}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <p className="text-[10px] text-slate-500">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                Back to Login
              </Link>
            </p>
          </div>
        </div>

        <motion.p className="text-center text-[9px] text-slate-400 mt-4 tracking-wider">
          © 2026 Jemigraph Photography Platform
        </motion.p>
      </motion.div>
    </div>
  );
}