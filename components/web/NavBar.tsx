"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBars,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaSignOutAlt,
  FaTachometerAlt,
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

interface PaymentPartnerLogo {
  id: string;
  name: string;
  logoUrl: string;
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.jemigraph.co.tz/api/v0.1"
).replace(/\/+$/, "");

const PARTNERS_ENDPOINT = `${API_URL}/payments/partners`;

const NavBar = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
  } = useAuth();

  const pathname = usePathname();

  const [paymentPartners, setPaymentPartners] = useState<
    PaymentPartnerLogo[]
  >([]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /*
   * ============================================================
   * FETCH PAYMENT PARTNERS FROM API
   * ============================================================
   */

  useEffect(() => {
    let cancelled = false;

    const fetchPaymentPartners = async () => {
      try {
        const response = await axios.get(PARTNERS_ENDPOINT, {
          timeout: 15000,
        });

        const result = Array.isArray(response.data)
          ? response.data
          : response.data?.data ??
            response.data?.partners ??
            response.data?.paymentPartners ??
            response.data?.content ??
            [];

        if (!Array.isArray(result) || cancelled) {
          return;
        }

        const activePartners: PaymentPartnerLogo[] = result
          .filter((item: any) => {
            if (!item) return false;

            if (
              item.enabled === false ||
              item.active === false
            ) {
              return false;
            }

            const status = item.status;

            return (
              status === undefined ||
              ["1", 1, true, "ACTIVE", "active", "ENABLED", "enabled"].includes(
                status
              )
            );
          })
          .map((item: any) => ({
            id: String(
              item.id ??
                item.paymentPartnerId ??
                item.provider ??
                item.partnerName ??
                item.name
            ),
            name: String(
              item.partnerName ??
                item.displayName ??
                item.name ??
                "Payment"
            ),
            logoUrl: String(
              item.logoUrl ??
                item.logoURL ??
                item.logo ??
                item.imageUrl ??
                ""
            ),
          }))
          .filter(
            (item: PaymentPartnerLogo) =>
              item.logoUrl.trim().length > 0
          )
          .filter(
            (
              item: PaymentPartnerLogo,
              index: number,
              list: PaymentPartnerLogo[]
            ) =>
              list.findIndex(
                (partner) => partner.id === item.id
              ) === index
          );

        if (!cancelled) {
          setPaymentPartners(activePartners);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load payment partners:",
            error
          );
        }
      }
    };

    void fetchPaymentPartners();

    return () => {
      cancelled = true;
    };
  }, []);

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
   * HIDE NAVBAR ON DASHBOARD
   * ============================================================
   */

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      {/* TOP CONTACT BAR */}

      <div className="hidden border-b-1 border-[#25632D] pb-2 bg-white py-2 text-[#25632D] sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          {/* Contact Info */}

          <div className="flex gap-5 text-[10px] font-bold tracking-wider opacity-80">
            <a
              href="mailto:info@jemigraph.co.tz"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <FaEnvelope className="text-[#25632D]" />
              info@jemigraph.co.tz
            </a>

            <a
              href="tel:+255746560832"
              className="flex items-center gap-1.5 transition-colors hover:text-[#25632D]"
            >
              <FaPhone className="text-[#25632D]" />
              +255 746 560 832
            </a>
          </div>

          {/* Payment Partners from API */}

          {paymentPartners.length > 0 && (
            <div className="flex items-center gap-2">
              {paymentPartners.map((partner) => (
                <div
                  key={partner.id}
                  title={partner.name}
                  className="flex h-6 items-center justify-center rounded-sm border border-white/10 bg-white/10 p-0.5 shadow-sm"
                >
                  <Image
                    src={partner.logoUrl}
                    width={80}
                    height={24}
                    alt={partner.name}
                    className="h-5 w-auto object-contain"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MAIN NAVIGATION */}

      <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center justify-between transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.png"
              width={50}
              height={50}
              alt="Jemigraph Logo"
              priority
              unoptimized
            />

            <div className="mx-2 text-2xl font-bold text-[#25632D]">
              jemigraph Tour
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <div className="hidden items-center gap-8 lg:flex">
            {/* PUBLIC NAVIGATION */}

            <div className="mr-4 flex items-center gap-7">
              {MAIN_NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  href={link.href}
                  className={cn(
                    "text-[12px] font-bold uppercase tracking-[0.1em] transition-all hover:text-[#25632D]",
                    pathname === link.href
                      ? "text-[#25632D]"
                      : "text-slate-500"
                  )}
                >
                  {link.path}
                </Link>
              ))}
            </div>

            {/* DIVIDER */}

            <div className="mx-1 h-8 w-px bg-slate-200" />

            {/* AUTH SECTION */}

            <div className="flex items-center gap-4">
              {isLoading ? (
                <div className="h-9 w-[136px] animate-pulse rounded-md bg-slate-100" />
              ) : !isAuthenticated ? (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 rounded-md bg-[#25632D] px-5 py-2.5 text-[11px] font-bold tracking-widest text-white transition-all hover:bg-[#1f5225]"
                >
                  <FaLock />
                  LOGIN
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 outline-none transition-all hover:border-[#25632D]"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.avatar}
                          alt={user?.name || "User"}
                        />

                        <AvatarFallback className="bg-[#25632D] text-xs font-bold text-white">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>

                      <span className="max-w-[100px] truncate text-xs font-bold text-slate-700">
                        {userName}
                      </span>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-amber-50"
                  >
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">
                          {user?.name}
                        </span>

                        <span className="truncate text-xs text-slate-500">
                          {user?.email}
                        </span>

                        <span className="mt-1 text-[10px] font-bold uppercase text-[#25632D]">
                          {user?.role}
                        </span>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <FaTachometerAlt />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* MOBILE MENU TOGGLE */}

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="p-2 text-[#25632D] lg:hidden"
            onClick={() =>
              setMobileMenuOpen((previous) => !previous)
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

      {/* MOBILE MENU */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] z-40 animate-in slide-in-from-right overflow-y-auto bg-white p-6 duration-300 lg:hidden">
          <div className="flex flex-col gap-4">
            {/* PUBLIC NAV LINKS */}

            {MAIN_NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "py-2 text-[14px] font-bold uppercase tracking-[0.1em] transition-all hover:text-emerald-700",
                  pathname === link.href
                    ? "text-emerald-700"
                    : "text-slate-500"
                )}
              >
                {link.path}
              </Link>
            ))}

            <div className="my-2 h-px bg-slate-100" />

            {isLoading ? (
              <div className="h-12 animate-pulse rounded-2xl bg-white" />
            ) : isAuthenticated ? (
              <>
                {/* USER INFO */}

                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.avatar}
                      alt={user?.name || "User"}
                    />

                    <AvatarFallback className="bg-[#25632D] font-bold text-white">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {user?.name}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* DASHBOARD */}

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#25632D] px-6 py-3 text-[12px] font-bold tracking-widest text-white"
                >
                  <FaTachometerAlt />
                  Dashboard
                </Link>

                {/* ADMIN PANEL */}

                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-[12px] font-bold tracking-widest text-white"
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
                    void handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-3 text-[12px] font-bold tracking-widest text-rose-600"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              /* NON AUTHENTICATED */

              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded bg-[#25632D] px-6 py-3 text-[12px] font-bold tracking-widest text-white"
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