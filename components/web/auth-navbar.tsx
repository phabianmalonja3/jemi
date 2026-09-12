"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCamera, FaSignInAlt, FaTachometerAlt } from 'react-icons/fa';
import { Button } from "@/components/ui/button";

export default function AuthNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
                isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-white py-4'
            }`}
        >
            <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
                
                {/* Brand Logo */}
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-emerald-600 transition-colors">
                        <FaCamera className="text-white text-lg" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                        FlashSync
                    </span>
                </Link>

                {/* Right Side Actions: Dashboard & Login Buttons */}
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" className="font-semibold text-slate-700 hover:text-emerald-600">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <FaTachometerAlt className="text-sm" />
                            Dashboard
                        </Link>
                    </Button>

                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm">
                        <Link href="/auth/login" className="flex items-center gap-2">
                            <FaSignInAlt className="text-sm" />
                            Login
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.nav>
    );
}