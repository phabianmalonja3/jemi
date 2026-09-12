"use client";

import React, { useState } from "react";
import {
    FaBars, FaTimes, FaPhone, FaEnvelope, FaLock,
    FaUser, FaSignOutAlt, FaCreditCard, FaCamera,
    FaTachometerAlt,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MAIN_NAV_LINKS } from "@/lib/constants/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import AuthNavButton from "./AuthNavButton";

const NavBar = () => {
    // Tunachukua user, isAuthenticated, na logout moja kwa moja kutoka AuthContext
    const { user, isAuthenticated, logout } = useAuth(); 
    const pathname = usePathname();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
    };
  
    if (pathname.startsWith("/dashboard")) return null;

    const paymentPartners = [
      { src: "/logos/mpesa.png", alt: "M-Pesa", width: 100 },
      { src: "/logos/yas.png", alt: "Yas", width: 110 },
      { src: "/logos/airtel.png", alt: "Airtel Money", width: 100 },
      { src: "/logos/crdb.png", alt: "CRDB Bank", width: 130 },
    ];
    
    // Kupata herufi ya kwanza ya jina la user kwa ajili ya Avatar
    const userInitial = user?.name?.charAt(0).toUpperCase() || "U";
    const userName = user?.name?.split(' ')[0] || user?.name || "User";

    return (
        <>
            <div className="bg-[#25632D] text-white py-2 hidden sm:block border-b border-white/5">
              <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                
                {/* Contact Info */}
                <div className="flex gap-5 opacity-80 text-[10px] font-bold tracking-wider">
                  <a href="mailto:info@jemigraph.co.tz" className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <FaEnvelope className="text-emerald-400" /> info@jemigraph.co.tz
                  </a>
                  <a href="tel:+255746560832" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                    <FaPhone className="text-emerald-400" /> +255 746 560 832
                  </a>
                </div>

                {/* Payment Partners */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {paymentPartners.map((logo) => (
                      <div key={logo.alt} className="bg-white/10 p-0.5 rounded-sm border border-white/10 shadow-sm">
                        <Image
                          src={logo.src}
                          width={logo.width}
                          height={24}
                          alt={logo.alt}
                          className="h-5 w-auto object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>

            {/* --- MAIN NAV --- */}
            <nav className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
                    <Link href="/" className="hover:opacity-80 transition-opacity flex items-center justify-between">
                        <Image src="/logo.png" width={50} height={50} alt="Logo" priority unoptimized />
                        <div className="mx-2 font-bold text-2xl text-[#25632D]">Jemigraph</div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        <div className="flex items-center gap-7 mr-4">
                            {MAIN_NAV_LINKS.map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.href}
                                    className={cn(
                                        "text-[12px] font-bold tracking-[0.1em] uppercase transition-all hover:text-[#25632D]",
                                        pathname === link.href ? "text-[#25632D]" : "text-slate-500"
                                    )}
                                >
                                    {link.path}
                                </Link>
                            ))}
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200 mx-1" />
                        <div className="flex items-center gap-4">
                          
                               <AuthNavButton />
                          
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <button className="lg:hidden p-2 text-[#25632D]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-20 bg-white z-40 p-6 shadow-xl animate-in slide-in-from-right duration-300 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        {MAIN_NAV_LINKS.map((link) => (
                            <Link
                                key={link.path}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "text-[14px] font-bold tracking-[0.1em] uppercase transition-all hover:text-emerald-700 py-2",
                                    pathname === link.href ? "text-emerald-700" : "text-slate-500"
                                )}
                            >
                                {link.path}
                            </Link>
                        ))}
                        <div className="h-px bg-slate-100 my-2" />
                        <Link
                            href="/booking"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-full font-bold text-[12px] uppercase tracking-widest transition-all"
                        >
                            <FaCamera /> Find Photographer
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 bg-[#25632D] text-white px-6 py-3 rounded-2xl font-bold text-[12px] tracking-widest"
                                >
                                    <FaTachometerAlt /> Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 border border-rose-200 px-6 py-3 rounded-2xl font-bold text-[12px] tracking-widest"
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 bg-[#25632D] text-white px-6 py-3 rounded-2xl font-bold text-[12px] tracking-widest"
                            >
                                <FaLock /> LOGIN
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default NavBar;