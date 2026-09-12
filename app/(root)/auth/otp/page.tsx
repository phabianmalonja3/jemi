"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

function OtpClientPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "your email";
    
    const { verifyAdminOtp } = useAuth();
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(60);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [resendTimer]);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        setError("");

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").trim();
        if (pasteData.length === 6 && !isNaN(Number(pasteData))) {
            const newOtp = pasteData.split("");
            setOtp(newOtp);
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");

        if (code.length < 6) {
            setError("Please enter the complete 6-digit code");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const result = await verifyAdminOtp(email, code);

            if (!result.success) {
                throw new Error(result.message || "Invalid verification code");
            }

            toast.success("Admin verification successful!");
            router.push("/dashboard");
        } catch (err: any) {
            console.error("OTP verification error:", err);
            setError(err.message || "Invalid verification code. Please try again.");
            toast.error("Invalid code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0 || isResending) return;

        setIsResending(true);
        try {
            await axios.post(`${BASE_URL}/auth/resend-admin-otp`, { email });
            toast.success("A new verification code has been sent!");
            setResendTimer(60);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to resend code. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/60">
                    <div className="mb-6">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
                        >
                            <ArrowLeft size={14} /> Back to Login
                        </Link>
                    </div>

                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-2xl mb-4 text-emerald-600 shadow-inner">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Security Verification
                        </h1>
                        <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                            We’ve sent a 6-digit confirmation code to <br />
                            <span className="font-semibold text-slate-700">{email}</span>
                        </p>
                    </div>

                    {/* Ujumbe wa muda wa kuisha kwa OTP (Dakika 10) */}
                    <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 mb-6">
                        <p className="text-[11px] text-amber-700 font-medium text-center flex items-center justify-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            This verification code will expire in 10 minutes.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-12 h-14 text-center text-xl font-bold border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white/80 outline-none"
                                />
                            ))}
                        </div>

                        {error && (
                            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3">
                                <p className="text-xs text-rose-600 flex items-center gap-2">
                                    <AlertCircle size={14} />
                                    {error}
                                </p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 font-bold text-base rounded-xl shadow-lg shadow-emerald-600/25 transition-all duration-300 disabled:opacity-50 text-white"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span className="text-sm">Verifying Code...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={18} />
                                    <span className="text-sm">Verify & Continue</span>
                                </div>
                            )}
                        </Button>

                        <div className="text-center pt-2">
                            <p className="text-xs text-slate-400">
                                Didn't receive the code?{" "}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendTimer > 0 || isResending}
                                    className={`font-bold transition-colors ${
                                        resendTimer > 0
                                            ? "text-slate-400 cursor-not-allowed"
                                            : "text-emerald-600 hover:text-emerald-700 hover:underline"
                                    }`}
                                >
                                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                                </button>
                            </p>
                        </div>
                    </form>
                </div>

                <p className="text-center text-[10px] text-slate-500 mt-6 tracking-wider">
                    © {new Date().getFullYear()} Jemigraph Photography Platform. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}

export default OtpClientPage;