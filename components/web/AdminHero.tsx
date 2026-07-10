"use client";

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Users, Wallet, Camera, FileCheck, AlertCircle, 
  Calendar, Download 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import RecentTransactionsTable from './RecentTransactionsTable';
import PendingApprovalsTable from './PendingApprovalsTable';
import { da } from 'date-fns/locale';

export function AdminHero() {
  const [photographerCount, setPhotographerCount] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotographers = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || null;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/photographers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        throw new Error("Session expired. Please login again.");
      }
      // if (!res.ok) throw new Error('Failed to fetch data');

      const data = await res.json();

    
      
      setTotalUser(data.length);
      const filtered =  data;
      setPhotographerCount(data.totalElements);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotographers();
  }, []);

  const stats = [
    { label: "Total Revenue", value: "TZS 4.2M", icon: Wallet, color: "emerald", bg: "bg-emerald-50" },
    { label: "Active Photographers", value: loading ? "..." : photographerCount, icon: Camera, color: "blue", bg: "bg-blue-50" },
    { label: "Registered Users", value: loading ? "..." : totalUser, icon: Users, color: "amber", bg: "bg-amber-50" },
    { label: "Pending Transactions", value: "8", icon: FileCheck, color: "rose", bg: "bg-rose-50" },
  ];

  const getColorStyles = (color: string) => {
    const colors: any = {
      emerald: { text: "text-emerald-600", bg: "bg-emerald-50" },
      blue: { text: "text-blue-600", bg: "bg-blue-50" },
      amber: { text: "text-amber-600", bg: "bg-amber-50" },
      rose: { text: "text-rose-600", bg: "bg-rose-50" },
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">System Overview</h1>
          <p className="text-slate-500 text-base mt-1">Welcome back, Super Admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button onClick={fetchPhotographers} className="font-bold underline ml-2">Try Again</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const colors = getColorStyles(stat.color);
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", colors.bg)}>
                <stat.icon className={cn("w-6 h-6", colors.text)} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">
                {loading ? <div className="h-8 w-20 bg-slate-200 animate-pulse rounded" /> : stat.value}
              </h3>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactionsTable />
        <PendingApprovalsTable />
      </div>
    </div>
  );
}