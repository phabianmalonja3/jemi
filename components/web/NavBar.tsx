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

interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'PHOTOGRAPHER';
    avatar?: string;
}

const NavBar = () => {

   const { isAuthenticated,logout } = useAuth(); 
    const pathname = usePathname();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);



    


    const handleLogout = async () => {
        logout();
    
        setTimeout(() => {
            window.location.href = "/auth/login";
        }, 1000);
    };
  
    if (pathname.startsWith("/dashboard")) return null;
const paymentPartners = [
  { src: "/logos/mpesa.png", alt: "M-Pesa", width: 100 },
  { src: "/logos/yas.png", alt: "Yas", width: 110 },
  { src: "/logos/airtel.png", alt: "Airtel Money", width: 100 },
  { src: "/logos/crdb.png", alt: "CRDB Bank", width: 130 },
];
    
    // Get user initial for avatar fallback
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
                    <Link href="/" className="hover:opacity-80 transition-opacity flex items-center justify-between grid-cols-2">
                        <Image src="/logo.png" width={50} height={50} alt="Logo" priority unoptimized />
                        <div className="mx-2 font-bold text-2xl text-[#25632D]">JemiGraph</div>
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
                            {isAuthenticated ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0 border-2 border-emerald-500/20 hover:border-emerald-500 transition-all">
                                            <Avatar className="h-full w-full">
                                                <AvatarImage src={user?.avatar || "/avatar.jpg"} alt="User" />
                                                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                                                    {userInitial}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <DropdownMenuLabel className="flex flex-col gap-1">
                                            <span className="text-sm font-bold">{userName}</span>
                                            <span className="text-[10px] text-slate-400 font-normal">{user?.email}</span>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard" className="cursor-pointer py-2">
                                                <FaTachometerAlt className="mr-2 h-4 w-4" /> Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard/profile" className="cursor-pointer py-2">
                                                <FaUser className="mr-2 h-4 w-4" /> My Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard/admin/wallet" className="cursor-pointer py-2">
                                                <FaCreditCard className="mr-2 h-4 w-4" /> Wallet
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer font-bold py-2">
                                            <FaSignOutAlt className="mr-2 h-4 w-4" /> Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                /* Show Login Button when NOT logged in - Navigate to login page */
                                <Link
                                    href="/auth/login"
                                    className="bg-[#25632D] hover:bg-[#25632D] text-white px-8 py-2 rounded-2xl font-bold text-[11px] tracking-widest shadow-xl flex items-center gap-2"
                                >
                                    <FaLock className="text-[10px]" /> LOGIN
                                </Link>
                            )}
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
                                <div className="flex items-center gap-3 pt-2">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-lg">
                                            {userInitial}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-slate-900">{userName}</p>
                                        <p className="text-[10px] text-slate-400">{user?.email}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 text-slate-700 font-semibold py-2"
                                >
                                    <FaTachometerAlt /> Dashboard
                                </Link>
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 text-slate-700 font-semibold py-2"
                                >
                                    <FaUser /> Profile
                                </Link>
                                <Link
                                    href="/billing"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 text-slate-700 font-semibold py-2"
                                >
                                    <FaCreditCard /> Payments
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-2 text-red-600 font-bold py-2"
                                >
                                    <FaSignOutAlt /> Sign Out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 bg-emerald-950 hover:bg-emerald-900 text-white px-6 py-3 rounded-2xl font-bold text-[12px] tracking-widest"
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