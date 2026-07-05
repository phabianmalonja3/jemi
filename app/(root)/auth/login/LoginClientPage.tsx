
"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { setAuthSession } from '@/lib/actions';
import Image from 'next/image';

function LoginClientPage() {

     const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted] = useState(false);


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api/v0.1';
  
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  // 1. Validation
  if (!loginEmail || !password) {
    setError('Please fill in all fields');
    setIsLoading(false);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(loginEmail)) {
    setError('Please enter a valid email address');
    setIsLoading(false);
    return;
  }

  try {
    // 2. Fetch token from backend
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: loginEmail,
      password: password,
    });

    const {refreshToken, accessToken, user } = response.data;

          console.log(response.data)
    
    if (accessToken) {

      localStorage.setItem("token",accessToken);
     localStorage.setItem("refreshToken",refreshToken)
      localStorage.setItem("user",JSON.stringify(user));
      
      await setAuthSession(accessToken, user);

    


      toast.success('Login successful!', {
        description: `Welcome back, ${user.name || user.email}!`,
        duration: 3000,
      });

      router.refresh();
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
  } catch (err: any) {
    console.error('Login error:', err);
  
    const status = err.response?.status;
    const message = err.response?.data?.message || 'Login failed. Please try again.';
    
    setError(status === 401 ? 'Invalid email or password' : message);
    
    toast.error('Login failed', {
      description: error || 'Please check your credentials.'+message,
    });
  } finally {
    setIsLoading(false);
  }
};
  return (
     <div className="relative min-h-screen py-3 overflow-hidden bg-linear-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center px-4">
      
      {/* Animated SVG Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Main gradient orbs - Larger */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute top-20 -left-20 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, 150, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-emerald-100/15 rounded-full blur-3xl"
        />

        {mounted && (
          <>
            {[...new Array(20)].map((_, i) => {
              const x = 10 + (i * 7) % 80;
              const y = 15 + (i * 11) % 70;
              const size = 3 + (i % 6);
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
                    y: ["-40px", "0px", "40px", "0px"],
                    x: ["25px", "-25px", "20px", "0px"],
                    scale: [0, 1, 1, 0],
                    opacity: [0, 0.9, 0.9, 0],
                  }}
                  transition={{
                    duration: 6 + (i % 4),
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut"
                  }}
                  className="absolute rounded-full bg-linear-to-br from-emerald-500 to-emerald-700 shadow-lg"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                />
              );
            })}
          </>
        )}

        {/* Grid pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-slate-900" />
        </svg>

        {/* Animated gradient lines */}
        <motion.div
          animate={{
            x: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-emerald-500 to-transparent"
        />
        
        <motion.div
          animate={{
            x: ["100%", "0%", "100%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 7.5
          }}
          className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-blue-500 to-transparent"
        />
      </div>

      {/* Login Card - Larger and clearer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/60">
          
          {/* Logo and Header - Larger */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 ">
            <Image
            src={"/logo.png"}
            width={80}
            height={80}
            alt='logo'
            
            />
            </div>
        
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 text-sm mt-2">Sign in to your Jemigraph account</p>
          </motion.div>

          {/* Form - Larger inputs */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="text-[11px] font-bold uppercase text-slate-600 tracking-wider flex items-center gap-2">
                <Mail size={12} />
                Email Address
              </label>
              <div className="relative">
                <Input 
                  className="h-12 pl-11 text-base border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all rounded-xl bg-white/80"
                  type="email" 
                  placeholder="Enter Your Email"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setError('');
                  }}
                  required 
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold uppercase text-slate-600 tracking-wider flex items-center gap-2">
                  <Lock size={12} />
                  Password
                </label>
                <Link 
                  href="/auth/forgot-password"
                  className="text-[10px] text-emerald-600 font-bold hover:text-emerald-700 transition-colors hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  className="h-12 pl-11 pr-11 text-base border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all rounded-xl bg-white/80"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required 
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 border border-rose-200 rounded-xl p-3"
              >
                <p className="text-xs text-rose-600 flex items-center gap-2">
                  <AlertCircle size={14} />
                  {error}
                </p>
              </motion.div>
            )}

            {/* Submit Button - Larger */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-3"
            >
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 font-bold text-base rounded-xl shadow-lg shadow-emerald-600/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-sm">Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn size={18} />
                    <span className="text-sm">Login to System</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-slate-200 text-center"
          >
            
          </motion.div>
        </div>

        {/* Decorative bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-[10px] text-slate-500 mt-6 tracking-wider"
        >
          © {new Date().getFullYear()}Jemigraph Photography Platform. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default LoginClientPage