// ServerMetricsDashboard.tsx
'use client';
import { apiClient } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function ServerMetricsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchServerStatus = async () => {
    try {
      const response = await apiClient.get('/server/status');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch server metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerStatus();
    // Auto-refresh every 10 seconds using the configured apiClient
    const interval = setInterval(fetchServerStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) return <div className="p-6 text-slate-400">Loading server metrics...</div>;
  if (!stats) return <div className="p-6 text-red-400">Error loading server metrics</div>;

  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* CPU Card */}
      <div className="bg-slate-800 p-4 rounded-lg flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-blue-400">CPU Usage</h3>
          <p className="text-2xl font-bold mt-2">{stats?.cpu?.usagePercentage}%</p>
        </div>
        <span className="text-xs text-slate-400 mt-3 truncate" title={stats?.cpu?.name}>
          {stats?.cpu?.name}
        </span>
      </div>

      {/* RAM Card */}
      <div className="bg-slate-800 p-4 rounded-lg flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-green-400">RAM Memory</h3>
          <p className="text-2xl font-bold mt-2">
            {stats?.ram?.usedGB?.toFixed(1)} GB / {stats?.ram?.totalGB?.toFixed(1)} GB
          </p>
        </div>
        <span className="text-xs text-slate-400 mt-3">
          Available: {stats?.ram?.availableGB?.toFixed(1)} GB
        </span>
      </div>

      {/* Storage Card */}
      <div className="bg-slate-800 p-4 rounded-lg md:col-span-3">
        <h3 className="text-lg font-semibold text-yellow-400 mb-3">Storage Disks</h3>
        {stats?.storage?.map((disk: any, index: number) => (
          <div key={index} className="mb-3 last:mb-0">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{disk.name} ({disk.mount})</span>
              <span className={disk.usagePercentage > 85 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                {disk.usedGB?.toFixed(1)} GB / {disk.totalGB?.toFixed(1)} GB ({disk.usagePercentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${disk.usagePercentage > 85 ? 'bg-red-500' : 'bg-blue-500'}`} 
                style={{ width: `${disk.usagePercentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}