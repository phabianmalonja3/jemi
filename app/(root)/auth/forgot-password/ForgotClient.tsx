"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ForgotClient({ token }: { readonly token: any }) {
  const base_url = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (token) {
      router.push('/dashboard');
    }
  }, [router, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!email) {
      setError('Please Email is Required !');
      setIsLoading(false);
      return;
    }

    // Define Axios Request Promise pointing to your Spring Boot /auth route
    const resetPromise = axios.post(`${base_url}/auth/forgot-password`, {
      email: email,
    });

    // Use sonner toast to trace request state cleanly
    toast.promise(resetPromise, {
      loading: 'Sending recovery link...',
      success: (response) => {
        setIsSent(true);
        // Extracts the 'message' field from the backend's ResponseEntity map
        return response.data?.message || 'Password reset link has been sent to your email.';
      },
      error: (err: any) => {
        // Fallback checks for explicit error details from the server
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center px-4">
      
      {/* Animated SVG Background Orbs */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute top-20 -left-20 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute bottom-20 -right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, 120, 0],
            y: [0, -40, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-100/10 rounded-full blur-3xl"
        />

        {/* Ambient Particles */}
        {mounted && (
          <>
            {[...Array(15)].map((_, i) => {
              const x = 10 + (i * 7) % 80;
              const y = 15 + (i * 11) % 70;
              const size = 2 + (i % 5);
              const delay = (i * 0.3) % 5;
              
              return (
                <motion.div
                  key={i}
                  initial={{
                    x: `${x}%`,
                    y: `${y}%`,
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{
                    y: ["-30px", "0px", "30px", "0px"],
                    x: ["20px", "-20px", "15px", "0px"],
                    scale: [0, 1, 1, 0],
                    opacity: [0, 0.8, 0.8, 0],
                  }}
                  transition={{
                    duration: 6 + (i % 4),
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut"
                  }}
                  className="absolute rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-400/20"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                />
              );
            })}

            {[...Array(8)].map((_, i) => {
              const x = 20 + (i * 9) % 60;
              const y = 25 + (i * 13) % 50;
              const size = 3 + (i % 4);
              const delay = (i * 0.4) % 5;
              
              return (
                <motion.div
                  key={`glow-${i}`}
                  initial={{
                    x: `${x}%`,
                    y: `${y}%`,
                  }}
                  animate={{
                    y: ["-40px", "0px", "40px", "0px"],
                    x: ["30px", "-30px", "20px", "0px"],
                  }}
                  transition={{
                    duration: 8 + (i % 4),
                    repeat: Infinity,
                    delay: delay + 2,
                    ease: "easeInOut"
                  }}
                  className="absolute rounded-full bg-emerald-300/40 blur-sm"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${size + 4}px`,
                    height: `${size + 4}px`,
                  }}
                />
              );
            })}
          </>
        )}

        {/* Grid pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-slate-900" />
        </svg>

        {/* Top & Bottom moving gradient lines */}
        <motion.div
          animate={{ x: ["0%", "100%", "0%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
        />
        <motion.div
          animate={{ x: ["100%", "0%", "100%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 7.5 }}
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
        />
      </div>

      {/* Forgot Password Card CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/50">
          
          {/* Back Button */}
          <Link href="/auth/login">
            <motion.button
              whileHover={{ x: -3 }}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-600 transition-colors mb-6"
              type="button"
            >
              <ArrowLeft size={14} />
              Back to Login
            </motion.button>
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl shadow-md mb-3">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reset Password</h1>
            <p className="text-slate-500 text-xs mt-1">
              Enter your email to receive reset instructions
            </p>
          </motion.div>

          {/* Success State Layout */}
          {isSent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Check Your Email</h3>
                <p className="text-xs text-slate-500 mt-1">
                  We've sent password reset instructions to:
                </p>
                <p className="text-sm font-bold text-emerald-600 mt-2 break-all px-2">{email}</p>
                <p className="text-xs text-slate-400 mt-4">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSent(false);
                      setEmail('');
                      setError('');
                    }}
                    className="text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    try again
                  </button>
                </p>
              </div>
              
              <Link href="/auth/login">
                <Button className="w-full h-10 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 font-bold text-sm rounded-lg shadow-md shadow-emerald-600/20">
                  Return to Login
                </Button>
              </Link>
            </motion.div>
          ) : (
            /* Request Form State Layout */
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-1.5"
              >
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Mail size={10} />
                  Email Address
                </label>
                <div className="relative">
                  <Input 
                    className="h-10 pl-9 text-sm border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all rounded-lg bg-white/50"
                    type="email" 
                    placeholder="hello@jemigraph.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    required 
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] text-rose-500 flex items-center gap-1 mt-1 font-medium"
                  >
                    <AlertCircle size={10} />
                    {error}
                  </motion.p>
                )}
              </motion.div>

              {/* Info Accent Card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100"
              >
                <p className="text-[10px] text-emerald-700 font-medium text-center">
                  We'll send you a link to reset your password securely.
                </p>
              </motion.div>

              {/* Action Trigger Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-2"
              >
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-10 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 font-bold text-sm rounded-lg shadow-md shadow-emerald-600/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-xs">Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center">
                      <Send size={14} />
                      <span className="text-xs">Send Reset Link</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          )}

          {/* Persistent Inline Form Navigation Footer */}
          {!isSent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 pt-4 border-t border-slate-200 text-center"
            >
              <p className="text-[10px] text-slate-500">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                  Back to Login
                </Link>
              </p>
            </motion.div>
          )}
        </div>

        {/* Platform Legal Copy Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-[9px] text-slate-400 mt-4 tracking-wider"
        >
          © 2026 Jemigraph Photography Platform
        </motion.p>
      </motion.div>
    </div>
  )
}