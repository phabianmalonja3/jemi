
"use client";

import React, { useState } from "react";
import {
  Bell,
  MagnifyingGlass,
  CaretDown,
  UserCircle,
  GearSix,
  SignOut,
  List,
  X,
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function SalesHeader() {
  const { user, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">

        <div className="hidden sm:block">
          <h1 className="text-lg font-black text-slate-900">
            Sales Portal
          </h1>

          <p className="text-xs text-slate-500">
            Manage your sales activities
          </p>
        </div>

      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3 md:gap-5">

        {/* SEARCH */}
        <div className="relative hidden md:block">
          <MagnifyingGlass
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search anything..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-all focus:border-[#25632D] focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* NOTIFICATIONS */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-emerald-50 hover:text-[#25632D]"
        >
          <Bell size={21} weight="regular" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border border-white bg-red-500" />
        </button>

        {/* PROFILE */}
        <div className="relative">

          <button
            type="button"
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-slate-50 md:gap-3"
          >

            {/* AVATAR */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25632D] text-sm font-bold text-white shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>

            {/* USER DETAILS */}
            <div className="hidden text-left md:block">
              <p className="max-w-32 truncate text-sm font-bold text-slate-800">
                {user?.name || "Sales Staff"}
              </p>

              <p className="text-xs text-slate-500">
                Sales Executive
              </p>
            </div>

            <CaretDown
              size={16}
              className={`hidden text-slate-400 transition-transform md:block ${
                showProfile ? "rotate-180" : ""
              }`}
            />

          </button>

          {/* PROFILE DROPDOWN */}
          {showProfile && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfile(false)}
              />

              <div className="absolute right-0 top-14 z-50 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

                {/* PROFILE INFO */}
                <div className="border-b border-slate-100 bg-slate-50 p-4">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {user?.name || "Sales Staff"}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {user?.email || "sales@jemigraph.com"}
                  </p>

                  <span className="mt-3 inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase text-[#25632D]">
                    Sales Account
                  </span>
                </div>

                {/* MENU */}
                <div className="p-2">

                  <Link
                    href="/sales/profile"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-[#25632D]"
                  >
                    <UserCircle size={19} />
                    My Profile
                  </Link>

                  <Link
                    href="/sales/settings"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-[#25632D]"
                  >
                    <GearSix size={19} />
                    Settings
                  </Link>

                  <button
                    type="button"
                    onClick={() => logout()}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <SignOut size={19} />
                    Logout
                  </button>

                </div>

              </div>
            </>
          )}

        </div>

      </div>

    </header>
  );
}
