
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  SquaresFour,
  UsersThree,
  CalendarCheck,
  CurrencyDollar,
  Wallet,
  ChartLineUp,
  Bell,
  GearSix,
  SignOut,
  List,
  X,
  CaretLeft,
  CaretRight,
  Camera,
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";


const menuItems = [
  {
    title: "Dashboard",
    href: "/sales/dashboard",
    icon: SquaresFour,
  },
  {
    title: "Customers",
    href: "/sales/customers",
    icon: UsersThree,
  },
  {
    title: "Photographers",
    href: "/sales/photographers",
    icon: Camera,
  },
  {
    title: "Bookings",
    href: "/sales/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Sales & Revenue",
    href: "/sales/revenue",
    icon: CurrencyDollar,
  },
  {
    title: "Commissions",
    href: "/sales/commissions",
    icon: Wallet,
  },
  {
    title: "Reports & Analytics",
    href: "/sales/reports",
    icon: ChartLineUp,
  },
  {
    title: "Notifications",
    href: "/sales/notifications",
    icon: Bell,
  },
];


export default function SalesSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-[#25632D] p-2 text-white lg:hidden"
      >
        {mobileOpen ? <X size={24} /> : <List size={24} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen flex-col
          border-r border-slate-200
          bg-white shadow-sm
          transition-all duration-300
          ${sidebarWidth}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* LOGO */}
        <div className="flex h-20 items-center justify-between border-b px-4">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                width={42}
                height={42}
                alt="Jemigraph"
              />
              <div>
                <h1 className="text-lg font-black text-slate-900">
                  Jemigraph
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#25632D]">
                  Sales Portal
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-[#25632D] lg:block"
          >
            {collapsed ? (
              <CaretRight size={20} />
            ) : (
              <CaretLeft size={20} />
            )}
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
          {!collapsed && (
            <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Sales Management
            </p>
          )}

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.title : ""}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-3
                  text-sm font-semibold transition-all
                  ${
                    active
                      ? "bg-[#25632D] text-white shadow-md shadow-emerald-900/10"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-[#25632D]"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <Icon size={22} weight={active ? "fill" : "regular"} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="border-t border-slate-100 p-3">
          

          {/* USER PROFILE */}
          <div className="mt-3 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25632D] font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">
                  {user?.name || "Sales Staff"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  Sales Team
                </p>
              </div>
            )}
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => logout()}
            title={collapsed ? "Logout" : ""}
            className={`
              mt-3 flex w-full items-center gap-3 rounded-lg
              px-3 py-3 text-sm font-semibold text-red-600
              hover:bg-red-50
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <SignOut size={22} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
