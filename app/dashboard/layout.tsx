"use client";

import { Sidebar } from "@/components/web/SideBar";
import { AuthProvider } from "@/context/AuthContext";

import { Toaster } from "sonner";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 ">
        {/* Sidebar sasa itasoma isOnline na Role yenyewe ndani ya component yake */}
        <Sidebar  />

        {/* Content Area */}
        <main className="flex-1 px-4 md:px-8 lg:ml-64 pt-4 transition-all duration-300">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

        {/* <Toaster position="top-center" richColors theme="dark" /> */}
      </div>
    </AuthProvider>
  );
}