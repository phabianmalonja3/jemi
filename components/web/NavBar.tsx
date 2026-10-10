"use client";

import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaSignOutAlt,
  FaCamera,
  FaTachometerAlt,
  FaUser,
  FaCog,
} from "react-icons/fa";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MAIN_NAV_LINKS } from "@/lib/constants/navigation";
import Image from "next/image";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/context/AuthContext";

const NavBar = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
  } = useAuth();

  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to sign out");
    }
  };

  /*
   * ============================================================
   * HIDE NAVBAR ON DASHBOARD
   * ============================================================
   */

  if (pathname.startsWith("/dashboard")) {
    return null;
  }


  const paymentPartners = [
    {
      src: "/logos/mpesa.png",
      alt: "M-Pesa",
      width: 100,
    },
    {
      src: "/logos/yas.png",
      alt: "Yas",
      width: 110,
    },
    {
      src: "/logos/airtel.png",
      alt: "Airtel Money",
      width: 100,
    },
    {
      src: "/logos/crdb.png",
      alt: "CRDB Bank",
      width: 130,
    },
  ];

  /*
   * ============================================================
   * USER INFO
   * ============================================================
   */

  const userInitial =
    user?.name?.charAt(0).toUpperCase() || "U";

  const userName =
    user?.name?.split(" ")[0] ||
    user?.name ||
    "User";

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      {/* ====================================================== */}
      {/* TOP CONTACT BAR                                       */}
      {/* ====================================================== */}

      <div className="bg-[#25632D] text-white py-2 hidden sm:block border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

          {/* Contact Info */}
          <div className="flex gap-5 opacity-80 text-[10px] font-bold tracking-wider">

            <a
              href="mailto:info@jemigraph.co.tz"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <FaEnvelope className="text-emerald-400" />

              info@jemigraph.co.tz
            </a>

            <a
              href="tel:+255746560832"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <FaPhone className="text-emerald-400" />

              +255 746 560 832
            </a>

          </div>

          {/* Payment Partners */}
          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2">

              {paymentPartners.map((logo) => (
                <div
                  key={logo.alt}
                  className="bg-white/10 p-0.5 rounded-sm border border-white/10 shadow-sm"
                >
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

      {/* ====================================================== */}
      {/* MAIN NAVIGATION                                       */}
      {/* ====================================================== */}

      <nav className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">

          {/* ================================================== */}
          {/* LOGO                                              */}
          {/* ================================================== */}

          <Link
            href="/"
            className="hover:opacity-80 transition-opacity flex items-center justify-between"
          >
            <Image
              src="/logo.png"
              width={50}
              height={50}
              alt="Jemigraph Logo"
              priority
              unoptimized
            />

            <div className="mx-2 font-bold text-2xl text-[#25632D]">
              jemigraph Tour
            </div>
          </Link>

          {/* ================================================== */}
          {/* DESKTOP NAVIGATION                                */}
          {/* ================================================== */}

          <div className="hidden lg:flex items-center gap-8">

            {/* PUBLIC NAVIGATION */}
            <div className="flex items-center gap-7 mr-4">

              {MAIN_NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  href={link.href}
                  className={cn(
                    "text-[12px] font-bold tracking-[0.1em] uppercase transition-all hover:text-[#25632D]",
                    pathname === link.href
                      ? "text-[#25632D]"
                      : "text-slate-500"
                  )}
                >
                  {link.path}
                </Link>
              ))}

            </div>

            {/* Divider */}
            <div className="h-8 w-[1px] bg-slate-200 mx-1" />

            {/* ================================================== */}
            {/* AUTH SECTION                                       */}
            {/* ================================================== */}

            <div className="flex items-center gap-4">

              {/* Loading */}
              {isLoading ? (
                <div className="w-34 h-9 rounded-md bg-slate-100 animate-pulse" />
              ) : !isAuthenticated ? (
                /* ================================================== */
                /* NON AUTHENTICATED                                  */
                /* ================================================== */

           <Link
  href="/auth/login"
  className="flex items-center gap-2 bg-[#25632D] hover:bg-[#1f5225] text-white px-5 py-2.5 rounded-md font-bold text-[11px] tracking-widest transition-all"
>
  <FaLock />
  LOGIN
</Link>
              ) : (
                /* ================================================== */
                /* AUTHENTICATED                                      */
                /* ================================================== */

                <DropdownMenu>

                  <DropdownMenuTrigger asChild>

                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 hover:border-[#25632D] transition-all outline-none"
                    >

                      <Avatar className="h-8 w-8">

                        <AvatarImage
                          src={user?.avatar}
                          alt={user?.name || "User"}
                        />

                        <AvatarFallback className="bg-[#25632D] text-white text-xs font-bold">
                          {userInitial}
                        </AvatarFallback>

                      </Avatar>

                      <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">
                        {userName}
                      </span>

                    </button>

                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-amber-50"
                  >

                    {/* USER */}
                    <DropdownMenuLabel>

                      <div className="flex flex-col">

                        <span className="font-semibold text-slate-800">
                          {user?.name}
                        </span>

                        <span className="text-xs text-slate-500 truncate">
                          {user?.email}
                        </span>

                        <span className="text-[10px] uppercase text-[#25632D] font-bold mt-1">
                          {user?.role}
                        </span>

                      </div>

                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* PROFILE */}
                    <DropdownMenuItem asChild>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <FaUser />

                        Profile
                      </Link>

                    </DropdownMenuItem>

                    {/* DASHBOARD */}
                    <DropdownMenuItem asChild>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <FaTachometerAlt />

                        Dashboard
                      </Link>

                    </DropdownMenuItem>

                    {/* PHOTOGRAPHER */}
                    {user?.role === "PHOTOGRAPHER" && (
                      <DropdownMenuItem asChild>

                        <Link
                          href="/dashboard/photographer"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <FaCamera />

                          Photographer
                        </Link>

                      </DropdownMenuItem>
                    )}

                    {/* ADMIN */}
                    {user?.role === "ADMIN" && (
                      <DropdownMenuItem asChild>

                        <Link
                          href="/admin"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <FaCog />

                          Admin Panel
                        </Link>

                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    {/* LOGOUT */}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <FaSignOutAlt className="mr-2" />

                      Logout
                    </DropdownMenuItem>

                  </DropdownMenuContent>

                </DropdownMenu>
              )}

            </div>

          </div>


          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 text-[#25632D]"
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
          >

            {mobileMenuOpen ? (
              <FaTimes size={26} />
            ) : (
              <FaBars size={26} />
            )}

          </button>

        </div>

      </nav>

      {/* ====================================================== */}
      {/* MOBILE MENU                                           */}
      {/* ====================================================== */}

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-white z-40 p-6 shadow-xl animate-in slide-in-from-right duration-300 overflow-y-auto">

          <div className="flex flex-col gap-4">

            {/* ================================================= */}
            {/* PUBLIC NAV LINKS                                 */}
            {/* ================================================= */}

            {MAIN_NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                href={link.href}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className={cn(
                  "text-[14px] font-bold tracking-[0.1em] uppercase transition-all hover:text-emerald-700 py-2",
                  pathname === link.href
                    ? "text-emerald-700"
                    : "text-slate-500"
                )}
              >
                {link.path}
              </Link>
            ))}

            <div className="h-px bg-slate-100 my-2" />

          
     

            {isLoading ? (
              <div className="h-12 rounded-2xl bg-white animate-pulse" />
            ) : isAuthenticated ? (
              <>

                {/* USER INFO */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100">

                  <Avatar className="h-10 w-10">

                    <AvatarImage
                      src={user?.avatar}
                      alt={user?.name || "User"}
                    />

                    <AvatarFallback className="bg-[#25632D] text-white font-bold">
                      {userInitial}
                    </AvatarFallback>

                  </Avatar>

                  <div className="min-w-0">

                    <p className="text-sm font-bold text-slate-800 truncate">
                      {user?.name}
                    </p>

                    <p className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </p>

                  </div>

                </div>

                {/* DASHBOARD */}
                <Link
                  href="/dashboard"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="flex items-center justify-center gap-2 bg-[#25632D] text-white px-6 py-3 rounded-2xl font-bold text-[12px] tracking-widest"
                >
                  <FaTachometerAlt />

                  Dashboard
                </Link>

                {/* PROFILE */}
                <Link
                  href="/profile"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-bold text-[12px] tracking-widest"
                >
                  <FaUser />

                  Profile
                </Link>

                {/* PHOTOGRAPHER */}
                {user?.role === "PHOTOGRAPHER" && (
                  <Link
                    href="/dashboard/photographer"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center justify-center gap-2 bg-emerald-50 text-[#25632D] border border-emerald-200 px-6 py-3 rounded-2xl font-bold text-[12px] tracking-widest"
                  >
                    <FaCamera />

                    Photographer
                  </Link>
                )}

                {/* ADMIN */}
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-[12px] tracking-widest"
                  >
                    <FaCog />

                    Admin Panel
                  </Link>
                )}

                {/* LOGOUT */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 border border-rose-200 px-6 py-3 rounded-2xl font-bold text-[12px] tracking-widest"
                >
                  <FaSignOutAlt />

                  Logout
                </button>

              </>
            ) : (
              /* ================================================= */
              /* NON AUTHENTICATED                                */
              /* ================================================= */

              <Link
                href="/auth/login"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex items-center justify-center gap-2 bg-[#25632D] text-white px-6 py-3 rounded font-bold text-[12px] tracking-widest"
              >
                <FaLock />

                LOGIN
              </Link>
            )}

          </div>

        </div>
      )}

    </>
  );
};

export default NavBar;
