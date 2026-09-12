// components/UserRegistrationChart.tsx
'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface UserRegistrationChartProps {
  data?: { date: string; count: number }[];
}

export default function UserRegistrationChart({ data: initialData }: UserRegistrationChartProps) {
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Dummy mock trend data if none is passed
  const mockData = {
    daily: [
      { date: 'Mon', count: 12 },
      { date: 'Tue', count: 19 },
      { date: 'Wed', count: 15 },
      { date: 'Thu', count: 28 },
      { date: 'Fri', count: 34 },
      { date: 'Sat', count: 42 },
      { date: 'Sun', count: 30 },
    ],
    weekly: [
      { date: 'Week 1', count: 120 },
      { date: 'Week 2', count: 185 },
      { date: 'Week 3', count: 240 },
      { date: 'Week 4', count: 310 },
    ],
    monthly: [
      { date: 'Jan', count: 450 },
      { date: 'Feb', count: 520 },
      { date: 'Mar', count: 680 },
      { date: 'Apr', count: 790 },
      { date: 'May', count: 950 },
      { date: 'Jun', count: 1120 },
    ],
  };

  const currentData = initialData || mockData[filter];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">User Registration Trends</h3>
          <p className="text-xs text-gray-500">Monitor new user signups and growth over time</p>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-medium ">
          <button
            onClick={() => setFilter('daily')}
            className={`px-3 py-1.5 rounded-md transition ${
              filter === 'daily' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setFilter('weekly')}
            className={`px-3 py-1.5 rounded-md transition ${
              filter === 'weekly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setFilter('monthly')}
            className={`px-3 py-1.5 rounded-md transition ${
              filter === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={currentData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`${value} users`, 'Signups']}
            />
            <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}