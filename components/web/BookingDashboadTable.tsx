"use client";

import React, { useEffect, useState } from 'react';
import { Search, Calendar, ArrowUpDown, RefreshCw, CheckCircle2, Clock, XCircle, TrendingUp } from 'lucide-react';

export default function BookingDashboardScreen() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    successRate: 0,
    cancellationRate: 0
  });

  const [range, setRange] = useState('24h');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // 1. Fetch Dashboard Stats
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token') || null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/dashboard/stats?range=${range}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // 2. Fetch Bookings List
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings?page=0&size=50&sort=createdAt,desc`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.content || []);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchBookings();
  }, [range]);

  // Filter bookings kutokana na Search Bar & Status
  const filteredBookings = bookings.filter((b: any) => {
    const clientName = b.client?.name || '';
    const photographerName = b.photographer?.name || '';
    const pkgName = b.pkg?.name || '';
    
    const matchesSearch = 
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photographerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkgName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto bg-[#0f1d32] min-h-screen text-white font-sans">
      
      {/* TOP HEADER & RANGE SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Booking Transactions & Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time monitoring and transaction history for Jemigraph.</p>
        </div>

        <div className="flex bg-[#162a4a] p-1 rounded-xl border border-blue-900/50">
          {['24h', '7d', '30d', 'all'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase transition ${
                range === r ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === 'all' ? 'All' : r}
            </button>
          ))}
        </div>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#162a4a] border border-blue-900/50 p-4 rounded-xl shadow-lg flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Success Rate</span>
          <div className="my-2">
            <h2 className="text-2xl font-black text-white">{stats.successRate}%</h2>
            <p className="text-xs text-slate-400">{stats.confirmedBookings} / {stats.totalBookings} successful</p>
          </div>
          <div className="w-full bg-[#0b1728] h-1.5 rounded-full overflow-hidden">
            <div style={{ width: `${stats.successRate}%` }} className="bg-green-500 h-full rounded-full"></div>
          </div>
        </div>

        <div className="bg-[#162a4a] border border-blue-900/50 p-4 rounded-xl shadow-lg flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Pending Bookings</span>
          <div className="my-2">
            <h2 className="text-2xl font-black text-white">{stats.pendingBookings}</h2>
            <p className="text-xs text-slate-400">Requiring action</p>
          </div>
          <div className="w-full bg-[#0b1728] h-1.5 rounded-full overflow-hidden">
            <div style={{ width: `${stats.totalBookings > 0 ? (stats.pendingBookings / stats.totalBookings) * 100 : 0}%` }} className="bg-yellow-500 h-full rounded-full"></div>
          </div>
        </div>

        <div className="bg-[#162a4a] border border-blue-900/50 p-4 rounded-xl shadow-lg flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Cancellation Rate</span>
          <div className="my-2">
            <h2 className="text-2xl font-black text-white">{stats.cancellationRate}%</h2>
            <p className="text-xs text-slate-400">{stats.cancelledBookings} cancelled</p>
          </div>
          <div className="w-full bg-[#0b1728] h-1.5 rounded-full overflow-hidden">
            <div style={{ width: `${stats.cancellationRate}%` }} className="bg-red-500 h-full rounded-full"></div>
          </div>
        </div>

        <div className="bg-[#162a4a] border border-blue-900/50 p-4 rounded-xl shadow-lg flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Bookings</span>
          <div className="my-2">
            <h2 className="text-2xl font-black text-white">{stats.totalBookings}</h2>
            <p className="text-xs text-slate-400">Overall volume</p>
          </div>
          <div className="w-full bg-[#0b1728] h-1.5 rounded-full overflow-hidden">
            <div className="w-full bg-blue-500 h-full rounded-full"></div>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-[#162a4a] p-4 rounded-xl shadow-lg border border-blue-900/50 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search client, photographer, package..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0b1728] text-white pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0b1728] text-white text-sm px-3 py-2 rounded-lg border border-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <button 
            onClick={() => { fetchStats(); fetchBookings(); }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center font-medium transition ml-auto md:ml-0"
          >
            <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* SCROLLABLE TRANSACTIONS / BOOKING DETAILS TABLE */}
      <div className="bg-[#162a4a] rounded-xl shadow-lg border border-blue-900/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="font-semibold text-base text-white">Transactions & Booking Records ({filteredBookings.length})</h3>
          <span className="text-xs text-slate-400">Scrollable Table</span>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0b1728] sticky top-0 text-slate-400 text-xs uppercase z-10">
              <tr>
                <th className="p-3.5">Client Name</th>
                <th className="p-3.5">Photographer</th>
                <th className="p-3.5">Package & Location</th>
                <th className="p-3.5">Amount (TZS)</th>
                <th className="p-3.5">Pickup Time</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-[#1a345a] transition">
                    <td className="p-3.5 font-medium text-white">{b.client?.name || 'N/A'}</td>
                    <td className="p-3.5 text-slate-300">{b.photographer?.name || 'N/A'}</td>
                    <td className="p-3.5">
                      <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded border border-blue-700">
                        {b.pkg?.name || 'Custom'}
                      </span>
                      <div className="text-xs text-slate-400 mt-0.5">{b.addressName}</div>
                    </td>
                    <td className="p-3.5 font-semibold text-white">
                      {b.amountPaid ? b.amountPaid.toLocaleString() : '0'}
                    </td>
                    <td className="p-3.5 text-xs text-slate-300">
                      {b.pickupTime ? new Date(b.pickupTime).toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${
                        b.status === 'COMPLETED' || b.status === 'ACCEPTED' ? 'bg-green-900/50 text-green-400 border border-green-700' :
                        b.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700' :
                        'bg-red-900/50 text-red-400 border border-red-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    {loading ? 'Loading records...' : 'No records found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}