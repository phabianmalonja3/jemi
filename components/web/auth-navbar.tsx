"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUser, FaSignOutAlt, FaCamera, FaHistory, FaCog, FaBell } from 'react-icons/fa';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AuthNavbar({ user }: { user: { name: string; email: string; image?: string; role?: string } }) {
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

                {/* Right Side Actions */}
                <div className="flex items-center gap-3 md:gap-6">
                    
                    {/* Notification Bell (Essential for Bookings) */}
                    <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-emerald-600">
                        <FaBell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </Button>

                    {/* User Profile Dropdown */}
                    <div className="flex items-center gap-3 border-l pl-4 md:pl-6 border-slate-200">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-bold text-slate-900 leading-none">
                                {user?.name || "Member"}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">
                                {user?.role || "Account"}
                            </p>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-emerald-500 transition-all">
                                    <Avatar className="h-10 w-10 border border-slate-100">
                                        <AvatarImage src={user?.image || "/avatar.jpg"} alt="User" />
                                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                                            {user?.name?.charAt(0) || <FaUser />}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-60 mt-2 rounded-2xl shadow-xl border-slate-100" align="end">
                                <DropdownMenuLabel className="font-normal p-4">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem asChild className="cursor-pointer py-3 focus:bg-emerald-50">
                                    <Link href="/profile" className="flex items-center w-full">
                                        <FaUser className="mr-3 h-4 w-4 text-emerald-600" /> My Profile
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild className="cursor-pointer py-3 focus:bg-emerald-50">
                                    <Link href="/bookings" className="flex items-center w-full">
                                        <FaHistory className="mr-3 h-4 w-4 text-emerald-600" /> Booking History
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild className="cursor-pointer py-3 focus:bg-emerald-50">
                                    <Link href="/settings" className="flex items-center w-full">
                                        <FaCog className="mr-3 h-4 w-4 text-emerald-600" /> Settings
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem 
                                    // onClick={handleLogout} 
                                    className="cursor-pointer py-3 text-red-600 focus:bg-red-50 focus:text-red-700"
                                >
                                    <FaSignOutAlt className="mr-3 h-4 w-4" /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}