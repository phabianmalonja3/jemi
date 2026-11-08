"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw, BarChart2 } from 'lucide-react';

export default function BookingsDetailsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
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

  // 1. Fetch Dashboard Stats kutoka Spring Boot
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

  // 2. Fetch Bookings List kutoka Spring Boot
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings?page=0&size=100&sort=createdAt,desc`, {
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

  // Filter bookings kwa ajili ya Search Bar na Status Dropdown
  const filteredBookings = useMemo(() => {
    return bookings.filter((b: any) => {
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
  }, [bookings, searchTerm, statusFilter]);

  // DYNAMIC CHART DATA GENERATOR
  const chartSlots = useMemo(() => {
    const slotsCount = 6;
    const now = new Date().getTime();
    
    let durationMs = 24 * 60 * 60 * 1000; // 24h
    if (range === '7d') durationMs = 7 * 24 * 60 * 60 * 1000;
    if (range === '30d') durationMs = 30 * 24 * 60 * 60 * 1000;
    if (range === 'all') durationMs = 365 * 24 * 60 * 60 * 1000;

    const intervalMs = durationMs / slotsCount;
    const startTime = now - durationMs;

    const buckets = Array.from({ length: slotsCount }, (_, i) => {
      const slotStart = startTime + i * intervalMs;
      const slotEnd = slotStart + intervalMs;
      
      const dateLabel = new Date(slotStart).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: range === '24h' ? '2-digit' : undefined 
      });

      return {
        label: dateLabel,
        start: slotStart,
        end: slotEnd,
        pending: 0,
        success: 0,
        failure: 0,
        total: 0
      };
    });

    filteredBookings.forEach((b: any) => {
      const bTime = new Date(b.createdAt || b.pickupTime).getTime();
      const bucket = buckets.find(slot => bTime >= slot.start && bTime < slot.end);
      
      if (bucket) {
        bucket.total += 1;
        if (b.status === 'COMPLETED' || b.status === 'ACCEPTED') {
          bucket.success += 1;
        } else if (b.status === 'PENDING') {
          bucket.pending += 1;
        } else if (b.status === 'CANCELLED') {
          bucket.failure += 1;
        }
      }
    });

    const maxHits = Math.max(...buckets.map(b => b.total), 1);

    return { buckets, maxHits };
  }, [filteredBookings, range]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto bg-white min-h-screen text-slate-900 font-sans">
      
      {/* TOP HEADER & RANGE SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Booking Details & Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time monitoring and transaction history for Jemigraph.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {['24h', '7d', '30d', 'all'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase transition ${
                range === r ? 'bg-emerald-500 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === 'all' ? 'All' : r}
            </button>
          ))}
        </div>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Success Rate */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase">Success Rate</span>
          <div className="my-2">
            <h2 className="text-2xl font-black text-emerald-500">{stats.successRate}%</h2>
            <p className="text-xs text-slate-500">{stats.confirmedBookings} / {stats.totalBookings} successful</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div style={{ width: `${stats.successRate}%` }} className="bg-green-500 h-full rounded-full"></div>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase">Pending Bookings</span>
          <div className="my-2">
            <h2 className="text-2xl font-black text-amber-500">{stats.pendingBookings}</h2>
            <p className="text-xs text-slate-500">Requiring action</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div style={{ width: `${stats.totalBookings > 0 ? (stats.pendingBookings / stats.totalBookings) * 100 : 0}%` }} className="bg-amber-500 h-full rounded-full"></div>
          </div>
        </div>

        {/* Cancellation Rate */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase">Cancellation Rate</span>
          <div className="my-2">
            <h2 className="text-2xl font-black text-slate-900">{stats.cancellationRate}%</h2>
            <p className="text-xs text-slate-500">{stats.cancelledBookings} cancelled</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div style={{ width: `${stats.cancellationRate}%` }} className="bg-red-500 h-full rounded-full"></div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Bookings</span>
          <div className="my-2">
            <h2 className="text-2xl font-black text-emerald-500">{stats.totalBookings}</h2>
            <p className="text-xs text-slate-500">Overall volume</p>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="w-full bg-emerald-500 h-full rounded-full"></div>
          </div>
        </div>

      </div>

      {/* DYNAMIC VISUAL ANALYTICS / ACTIVITY BAR CHART SECTION */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="text-emerald-500" size={20} />
            <h3 className="font-bold text-slate-900 text-sm">
              {filteredBookings.length} hits <span className="text-slate-400 font-normal text-xs ml-1">(Activity Timeline - Range: {range})</span>
            </h3>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-400 inline-block"></span> Pending
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-400 inline-block"></span> Failure/Cancelled
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span> Success
            </div>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-30 border-b border-l border-slate-200 relative flex items-end justify-around px-2 pb-2 pt-6">
          {/* Grid scale labels */}
          <div className="absolute inset-x-0 top-0 border-t border-slate-100 flex items-center text-[10px] text-slate-400 pl-2">
            {chartSlots.maxHits}
          </div>
          <div className="absolute inset-x-0 top-1/2 border-t border-slate-100 flex items-center text-[10px] text-slate-400 pl-2">
            {Math.round(chartSlots.maxHits / 2)}
          </div>
          <div className="absolute inset-x-0 bottom-0 border-t border-slate-100 flex items-center text-[10px] text-slate-400 pl-2">
            0
          </div>

          {/* Dynamic Stacked Bars */}
          {chartSlots.buckets.map((slot, index) => {
            const totalH = slot.total > 0 ? Math.max((slot.total / chartSlots.maxHits) * 100, 15) : 0;

            return (
              <div key={index} className="flex flex-col items-center group relative z-10 w-12 h-full justify-end">
                
                {/* Tooltip on Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition absolute -top-10 bg-slate-800 text-white text-[10px] p-1.5 rounded shadow pointer-events-none whitespace-nowrap z-30">
                  Total: {slot.total} (S: {slot.success}, P: {slot.pending}, F: {slot.failure})
                </div>

                {/* Stacked Bar Body */}
                <div className="w-8 flex flex-col justify-end gap-0.5 rounded-t overflow-hidden bg-slate-50" style={{ height: `${totalH}%` }}>
                  {slot.failure > 0 && (
                    <div 
                      style={{ height: `${(slot.failure / slot.total) * 100}%` }} 
                      className="bg-red-400 w-full min-h-[4px]" 
                    />
                  )}
                  {slot.pending > 0 && (
                    <div 
                      style={{ height: `${(slot.pending / slot.total) * 100}%` }} 
                      className="bg-amber-400 w-full min-h-[4px]" 
                    />
                  )}
                  {slot.success > 0 && (
                    <div 
                      style={{ height: `${(slot.success / slot.total) * 100}%` }} 
                      className="bg-emerald-500 w-full min-h-[4px]" 
                    />
                  )}
                  {slot.total === 0 && (
                    <div className="bg-slate-200 w-full h-1 rounded-t" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline Bottom Labels */}
        <div className="flex justify-between text-[11px] text-slate-400 px-4">
          {chartSlots.buckets.map((slot, i) => (
            <span key={i} className="text-center">{slot.label}</span>
          ))}
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search client, photographer, package..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <button 
            onClick={() => { fetchStats(); fetchBookings(); }}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm flex items-center font-medium transition ml-auto md:ml-0"
          >
            <RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* SCROLLABLE BOOKING DETAILS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-base text-slate-900">Booking Records ({filteredBookings.length})</h3>
          <span className="text-xs text-slate-400">Scrollable Table</span>
        </div>

        <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 text-slate-500 text-xs uppercase z-10 border-b border-slate-200">
              <tr>
                <th className="p-3.5">Client Name</th>
                <th className="p-3.5">Photographer</th>
                <th className="p-3.5">Package & Location</th>
                <th className="p-3.5">Amount (TZS)</th>
                <th className="p-3.5">Pickup Time</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-medium text-slate-900">{b.client?.name || 'N/A'}</td>
                    <td className="p-3.5 text-slate-700">{b.photographer?.name || 'N/A'}</td>
                    <td className="p-3.5">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 font-medium">
                        {b.pkg?.name || 'Custom'}
                      </span>
                      <div className="text-xs text-slate-400 mt-0.5">{b.addressName}</div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-900">
                      {b.amountPaid ? b.amountPaid.toLocaleString() : '0'}
                    </td>
                    <td className="p-3.5 text-xs text-slate-500">
                      {b.pickupTime ? new Date(b.pickupTime).toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${
                        b.status === 'COMPLETED' || b.status === 'ACCEPTED' ? 'bg-green-100 text-green-700 border border-green-200' :
                        b.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    {loading ? 'Loading records...' : 'No booking records found'}
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