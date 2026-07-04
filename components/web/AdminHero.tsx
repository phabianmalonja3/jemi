// @/components/dashboard/AdminHero.tsx
"use client";

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  BarChart3, Users, Wallet, ShieldCheck, TrendingUp, ArrowUpRight, 
  Activity, Calendar, DollarSign, UserCheck, AlertCircle, 
  ChevronRight, Download, MoreVertical, Eye, 
  Camera,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import RecentTransactionsTable from './RecentTransactionsTable';
import PendingApprovalsTable from './PendingApprovalsTable';


export function AdminHero() {

const [photographerCount, setPhotographerCount] = useState(0);
const [totalUser, setTotalUser] = useState(0);

useEffect(() => {
  // Pass an empty dependency array [] so this only runs ONCE on mount
  fetchPhotographers();
}, []); 

const fetchPhotographers = async () => {
  try {
    const token = localStorage.getItem('token');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error('Failed to fetch');

    const data = await res.json();
   setTotalUser(data.length)
    // Filter the data
    const photographers = data.filter((user: any) => user.role === 'PHOTOGRAPHER');
    

    console.log(data);
    const count = photographers.length;
    
    setPhotographerCount(count);
    console.log(`Total Photographers: ${count}`);
    
  } catch (error) {
    console.error("Error fetching photographers:", error);
  }
};
  const stats = [
  { 
    label: "Total Revenue", 
    value: "TZS 4.2M", 
    detail: "From Transactions",
    icon: Wallet, 
    color: "emerald",
    bg: "bg-emerald-50"
  },
  { 
    label: "Active Photographers", 
    value: photographerCount, 
    detail: "Available for hire",
    icon: Camera, // Badala ya Activity
    color: "blue",
    bg: "bg-blue-50"
  },
  { 
    label: "Registered Users", 
    value: totalUser,
    detail: "Active accounts",
    icon: Users, 
    color: "amber",
    bg: "bg-amber-50"
  },
  { 
    label: "Pending Transactions", 
    value: "8", 
    detail: "Voucher verification",
    icon: FileCheck, // Badala ya ShieldCheck
    color: "rose",
    bg: "bg-rose-50"
  },
];



  const getColorStyles = (color: string) => {
    const colors = {
      emerald: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dark: "bg-emerald-600" },
      blue: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dark: "bg-blue-600" },
      amber: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dark: "bg-amber-600" },
      rose: { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", dark: "bg-rose-600" },
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  const recentTransactions = [
    { id: 1, name: "Hillary Kipimo", type: "Wedding Session", location: "Dar es Salaam", amount: "+150,000", status: "completed", date: "2026-04-29" },
    { id: 2, name: "Sarah Juma", type: "Portrait Shoot", location: "Arusha", amount: "+75,000", status: "pending", date: "2026-04-28" },
    { id: 3, name: "John Doe", type: "Event Coverage", location: "Zanzibar", amount: "+200,000", status: "completed", date: "2026-04-27" },
    { id: 4, name: "Maryanne Peter", type: "Product Photography", location: "Moshi", amount: "+120,000", status: "pending", date: "2026-04-26" },
  ];

  const pendingApprovals = [
    { id: 1, name: "James Wilson", email: "james@photo.com", type: "Photographer", submitted: "2026-04-29" },
    { id: 2, name: "Anna Mushi", email: "anna@photography.com", type: "Photographer", submitted: "2026-04-28" },
    { id: 3, name: "Peter John", email: "peter@studio.com", type: "Studio Owner", submitted: "2026-04-27" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header Section - Larger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            System Overview
          </h1>
          <p className="text-slate-500 text-base mt-1">
            Welcome back, Super Admin. Here's what's happening today.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download size={18} />
            Export Report
          </button>
          <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2">
            <Calendar size={18} />
            This Month
          </button>
        </div>
      </div>

      {/* Stats Grid - Larger Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const colors = getColorStyles(stat.color);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors.bg)}>
                  <stat.icon className={cn("w-6 h-6", colors.text)} />
                </div>
                <div className="flex items-center gap-1">
                  <span className={cn(
                    "text-xs font-bold",
                    // stat.trend === "up" ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {/* {stat.change} */}
                  </span>
                  {/* <TrendingUp size={12} className={stat.trend === "up" ? "text-emerald-600" : "text-rose-600 transform rotate-180"} /> */}
                </div>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid - Larger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
       <RecentTransactionsTable  />
      
      <PendingApprovalsTable />
      </div>

      {/* Quick Stats Row - Larger */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-2xl p-5 border border-blue-100">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Platform Growth</p>
          <p className="text-2xl font-black text-blue-900 mt-1">+32%</p>
          <p className="text-[9px] text-blue-600 mt-1">vs last month</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-2xl p-5 border border-emerald-100">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Avg. Booking Value</p>
          <p className="text-2xl font-black text-emerald-900 mt-1">TZS 85k</p>
          <p className="text-[9px] text-emerald-600 mt-1">+5% increase</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-2xl p-5 border border-purple-100">
          <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Completion Rate</p>
          <p className="text-2xl font-black text-purple-900 mt-1">94%</p>
          <p className="text-[9px] text-purple-600 mt-1">Excellent</p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-2xl p-5 border border-amber-100">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Active Users</p>
          <p className="text-2xl font-black text-amber-900 mt-1">156</p>
          <p className="text-[9px] text-amber-600 mt-1">+18 this week</p>
        </div>
      </div>

      {/* Chart Section - Larger */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Revenue Overview</h3>
            <p className="text-xs text-slate-400 mt-1">Monthly earnings trend</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Week</button>
            <button className="px-3 py-1.5 text-[10px] font-semibold bg-emerald-50 text-emerald-600 rounded-lg transition-colors">Month</button>
            <button className="px-3 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Year</button>
          </div>
        </div>
        
        {/* Simple bar chart visualization - Larger */}
        <div className="flex items-end gap-2 h-40 mt-6">
          {[65, 45, 70, 55, 80, 75, 90, 85, 70, 60, 75, 82].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div 
                className="w-full bg-emerald-500/20 rounded-t-lg transition-all hover:bg-emerald-500/30"
                style={{ height: `${height * 0.5}px` }}
              >
                <div 
                  className="w-full bg-emerald-500 rounded-t-lg transition-all"
                  style={{ height: `${height * 0.4}px` }}
                />
              </div>
              <span className="text-[9px] text-slate-400 font-medium">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}