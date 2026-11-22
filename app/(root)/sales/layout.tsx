
"use client";

import React from "react";
import SalesSidebar from "@/components/web/SalesSidebar";
import SalesHeader from "@/components/web/SalesHeader";
// import SalesHeader from "@/components/web/SalesHeader";

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sidebar */}
      <SalesSidebar />

      {/* Main Content */}
      <div className="min-h-screen lg:ml-64">

        {/* Header */}
        <SalesHeader />

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
