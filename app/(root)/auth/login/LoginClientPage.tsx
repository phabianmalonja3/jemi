"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Mail,
    Lock,
    LogIn,
    Eye,
    EyeOff,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

function LoginClientPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLoading) return;

        setError("");

        // =========================
        // VALIDATION
        // =========================

        if (!loginEmail.trim() || !password.trim()) {
            setError("Please fill in all fields");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(loginEmail.trim())) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            const res = await login(
                loginEmail.trim(),
                password
            );

            if (res.success) {
                toast.success("Login successful!");

                // Refresh server components
                router.refresh();

                // Navigate to dashboard
                router.push("/dashboard");
            } else {
                const message =
                    res.message ||
                    "Invalid email or password";

                setError(message);
                toast.error(message);
            }
        } catch (err) {
            console.error("Login error:", err);

            const message =
                "An unexpected error occurred. Please try again later.";

            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center px-4 py-8">

            {/* =====================================================
                ANIMATED BACKGROUND
            ====================================================== */}

            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">

                {/* Emerald Orb */}

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
                        ease: "easeInOut",
                    }}
                    className="absolute top-20 -left-20 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl"
                />

                {/* Blue Orb */}

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
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
                />

                {/* Center Orb */}

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
                        ease: "easeInOut",
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-3xl"
                />

                {/* Floating Particles */}

                {[...Array(20)].map((_, i) => {
                    const x = 10 + (i * 7) % 80;
                    const y = 15 + (i * 11) % 70;
                    const size = 3 + (i % 6);
                    const delay = (i * 0.3) % 5;

                    return (
                        <motion.div
                            key={i}
                            initial={{
                                scale: 0,
                                opacity: 0,
                            }}
                            animate={{
                                y: [
                                    "-40px",
                                    "0px",
                                    "40px",
                                    "0px",
                                ],
                                x: [
                                    "25px",
                                    "-25px",
                                    "20px",
                                    "0px",
                                ],
                                scale: [0, 1, 1, 0],
                                opacity: [
                                    0,
                                    0.9,
                                    0.9,
                                    0,
                                ],
                            }}
                            transition={{
                                duration: 6 + (i % 4),
                                repeat: Infinity,
                                delay,
                                ease: "easeInOut",
                            }}
                            className="absolute rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg"
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                width: `${size}px`,
                                height: `${size}px`,
                            }}
                        />
                    );
                })}

                {/* Grid Pattern */}

                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.03]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern
                            id="login-grid"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 40 0 L 0 0 0 40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                            />
                        </pattern>
                    </defs>

                    <rect
                        width="100%"
                        height="100%"
                        fill="url(#login-grid)"
                        className="text-slate-900"
                    />
                </svg>

                {/* Top Animated Line */}

                <motion.div
                    animate={{
                        x: ["0%", "100%", "0%"],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                />

                {/* Bottom Animated Line */}

                <motion.div
                    animate={{
                        x: ["100%", "0%", "100%"],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 7.5,
                    }}
                    className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                />
            </div>

            {/* =====================================================
                LOGIN CARD
            ====================================================== */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: 30,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut",
                }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/60">

                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.9,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            delay: 0.2,
                        }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20">
                            <Image
                                src="/logo.png"
                                width={80}
                                height={80}
                                alt="Jemigraph logo"
                                priority
                            />
                        </div>

                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Welcome Back
                        </h1>

                        <p className="text-slate-500 text-sm mt-2">
                            Sign in to your Jemigraph account
                        </p>
                    </motion.div>

                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* EMAIL */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -20,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                delay: 0.3,
                            }}
                            className="space-y-2"
                        >
                            <label
                                htmlFor="email"
                                className="text-[11px] font-bold uppercase text-slate-600 tracking-wider flex items-center gap-2"
                            >
                                <Mail size={12} />
                                Email Address
                            </label>

                            <div className="relative">
                                <Input
                                    id="email"
                                    className="h-12 pl-11 text-base border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all rounded-xl bg-white/80"
                                    type="email"
                                    placeholder="Enter Your Email"
                                    value={loginEmail}
                                    autoComplete="email"
                                    onChange={(e) => {
                                        setLoginEmail(
                                            e.target.value
                                        );
                                        setError("");
                                    }}
                                    required
                                />

                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={18}
                                />
                            </div>
                        </motion.div>

                        {/* PASSWORD */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -20,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                delay: 0.4,
                            }}
                            className="space-y-2"
                        >
                            <div className="flex justify-between items-center">

                                <label
                                    htmlFor="password"
                                    className="text-[11px] font-bold uppercase text-slate-600 tracking-wider flex items-center gap-2"
                                >
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
                                    id="password"
                                    className="h-12 pl-11 pr-11 text-base border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all rounded-xl bg-white/80"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    autoComplete="current-password"
                                    onChange={(e) => {
                                        setPassword(
                                            e.target.value
                                        );
                                        setError("");
                                    }}
                                    required
                                />

                                <Lock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={18}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>
                        </motion.div>

                        {/* ERROR */}

                        {error && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -5,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                className="bg-rose-50 border border-rose-200 rounded-xl p-3"
                            >
                                <p className="text-xs text-rose-600 flex items-center gap-2">
                                    <AlertCircle size={14} />
                                    {error}
                                </p>
                            </motion.div>
                        )}

                        {/* LOGIN BUTTON */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.5,
                            }}
                            className="pt-3"
                        >
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 font-bold text-base rounded-xl shadow-lg shadow-emerald-600/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                                        <span className="text-sm">
                                            Authenticating...
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <LogIn size={18} />

                                        <span className="text-sm">
                                            Login to System
                                        </span>
                                    </div>
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    {/* =================================================
                        CARD FOOTER
                    ================================================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        transition={{
                            delay: 0.6,
                        }}
                        className="mt-8 pt-6 border-t border-slate-200 text-center"
                    >
                        <p className="text-xs text-slate-400">
                            Secure login to your Jemigraph account
                        </p>
                    </motion.div>

                </div>

                {/* COPYRIGHT */}

                <motion.p
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        delay: 0.7,
                    }}
                    className="text-center text-[10px] text-slate-500 mt-6 tracking-wider"
                >
                    © {new Date().getFullYear()} Jemigraph
                    Photography Platform. All rights reserved.
                </motion.p>

            </motion.div>
        </div>
    );
}

export default LoginClientPage;
