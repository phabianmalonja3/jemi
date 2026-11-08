"use client";

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  Users, Wallet, Camera, FileCheck, AlertCircle, 
  Calendar, Download, CheckCircle2, Clock, XCircle, TrendingUp 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import RecentTransactionsTable from './RecentTransactionsTable';
import PendingApprovalsTable from './PendingApprovalsTable';

export function AdminHero() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    successRate: 0,
    cancellationRate: 0
  });
  
  const [range, setRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token') || null;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/dashboard/stats?range=${range}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        throw new Error("Session expired. Please login again.");
      }
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');

      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [range]);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto bg-white min-h-screen text-slate-900">
      
      {/* Top Header & Range Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">System Overview</h1>
          <p className="text-slate-500 text-base mt-1">Welcome back, Super Admin. Here's what's happening today.</p>
        </div>

        {/* Time Range Buttons (24h, 7d, 30d, All) */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {['24h', '7d', '30d', 'all'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase transition ${
                range === r ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === 'all' ? 'All' : r}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* STATS CARDS GRID (Light Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. SUCCESS RATE CARD */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Success Rate</span>
            <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="my-4">
            <h2 className="text-3xl font-black text-slate-900">{stats.successRate}%</h2>
            <p className="text-xs text-slate-500 mt-1">
              {stats.confirmedBookings} / {stats.totalBookings} bookings successful
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div style={{ width: `${stats.successRate}%` }} className="bg-green-500 h-full rounded-full"></div>
          </div>
        </div>

        {/* 2. PENDING BOOKINGS CARD */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Pending Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Clock size={20} />
            </div>
          </div>
          <div className="my-4">
            <h2 className="text-3xl font-black text-slate-900">{stats.pendingBookings}</h2>
            <p className="text-xs text-slate-500 mt-1">Requires attention / action</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div style={{ width: `${stats.totalBookings > 0 ? (stats.pendingBookings / stats.totalBookings) * 100 : 0}%` }} className="bg-amber-500 h-full rounded-full"></div>
          </div>
        </div>

        {/* 3. CANCELLATION RATE CARD */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Cancellation Rate</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <XCircle size={20} />
            </div>
          </div>
          <div className="my-4">
            <h2 className="text-3xl font-black text-slate-900">{stats.cancellationRate}%</h2>
            <p className="text-xs text-slate-500 mt-1">{stats.cancelledBookings} cancelled bookings</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div style={{ width: `${stats.cancellationRate}%` }} className="bg-red-500 h-full rounded-full"></div>
          </div>
        </div>

        {/* 4. TOTAL BOOKINGS VOLUME CARD */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Total Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="my-4">
            <h2 className="text-3xl font-black text-slate-900">{stats.totalBookings}</h2>
            <p className="text-xs text-slate-500 mt-1">Overall platform volume</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="w-full bg-blue-600 h-full rounded-full"></div>
          </div>
        </div>

      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactionsTable />
        <PendingApprovalsTable />
      </div>
      
    </div>
  );
}