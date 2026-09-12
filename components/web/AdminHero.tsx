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
import UserRegistrationChart from './UserRegistrationChart';

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




  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900">System Overview</h1>
          <p className="text-slate-500 text-base mt-1">Welcome back, Super Admin. Here's what's happening today.</p>
        </div>
        
      </div>

      

      {/* Stats Grid */}
     <UserRegistrationChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactionsTable />
        <PendingApprovalsTable />
      </div>
    </div>
  );
}