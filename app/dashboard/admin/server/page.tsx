// ServerMetricsDashboard.tsx
'use client';
import { apiClient } from '@/lib/api';
import { useEffect, useState } from 'react';
import { CpuChipIcon, ServerIcon, CircleStackIcon, GlobeAltIcon, CommandLineIcon } from '@heroicons/react/24/outline';

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
    const interval = setInterval(fetchServerStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) return <div className="p-6 text-slate-400">Loading extended server metrics...</div>;
  if (!stats) return <div className="p-6 text-red-400">Error loading server metrics</div>;

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* OS & Host Metadata Bar */}
      {stats?.os && (
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CommandLineIcon className="w-5 h-5 text-purple-400" />
            <span className="text-slate-400">Host:</span>
            <strong className="text-white">{stats.os.hostName}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">OS:</span>
            <strong className="text-white">{stats.os.manufacturer} {stats.os.family} ({stats.os.version})</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Processes / Threads:</span>
            <strong className="text-white">{stats.os.processCount} / {stats.os.threadCount}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Uptime:</span>
            <strong className="text-emerald-400">{formatUptime(stats.os.uptimeSeconds)}</strong>
          </div>
        </div>
      )}

      {/* Main Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU Card */}
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg flex flex-col justify-between border border-slate-700">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                <CpuChipIcon className="w-5 h-5" /> CPU Usage
              </h3>
              {stats?.cpu?.maxFreqMHz && (
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                  {(stats.cpu.maxFreqMHz / 1000).toFixed(2)} GHz
                </span>
              )}
            </div>
            <p className="text-3xl font-bold mt-1 text-white">{stats?.cpu?.usagePercentage}%</p>
            <span className="text-xs text-slate-400 mt-2 block truncate" title={stats?.cpu?.name}>
              {stats?.cpu?.name} ({stats?.cpu?.cores} Cores / {stats?.cpu?.threads} Threads)
            </span>

            {/* Per-Core Usage Breakdown */}
            {stats?.cpu?.perCoreUsage && stats.cpu.perCoreUsage.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-700">
                <span className="text-xs font-semibold text-slate-400 mb-2 block">Per-Core Activity</span>
                <div className="grid grid-cols-4 gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {stats.cpu.perCoreUsage.map((coreLoad: number, idx: number) => (
                    <div key={idx} className="bg-slate-900 p-1.5 rounded text-center">
                      <div className="text-[10px] text-slate-400">C{idx}</div>
                      <div className="text-xs font-bold text-blue-300">{coreLoad}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RAM Card */}
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg flex flex-col justify-between border border-slate-700">
          <div>
            <h3 className="text-lg font-semibold text-green-400 flex items-center gap-2 mb-2">
              <ServerIcon className="w-5 h-5" /> RAM Memory
            </h3>
            <p className="text-2xl font-bold mt-1 text-white">
              {stats?.ram?.usedGB?.toFixed(1)} GB <span className="text-sm font-normal text-slate-400">/ {stats?.ram?.totalGB?.toFixed(1)} GB</span>
            </p>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden my-3">
              <div 
                className="h-full bg-green-500 transition-all duration-500" 
                style={{ width: `${(stats?.ram?.usedGB / stats?.ram?.totalGB) * 100}%` }}
              />
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>Available: <strong className="text-slate-200">{stats?.ram?.availableGB?.toFixed(1)} GB</strong></div>
              {stats?.ram?.swapTotalGB > 0 && (
                <div>Swap Used: <strong className="text-slate-200">{stats?.ram?.swapUsedGB?.toFixed(2)} GB / {stats?.ram?.swapTotalGB?.toFixed(2)} GB</strong></div>
              )}
            </div>
          </div>
        </div>

        {/* Storage Card */}
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg md:col-span-3 border border-slate-700">
          <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
            <CircleStackIcon className="w-5 h-5" /> Storage Disks
          </h3>
          <div className="space-y-4">
            {stats?.storage?.map((disk: any, index: number) => (
              <div key={index} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-200">{disk.name} <span className="text-xs text-slate-400">({disk.mount})</span></span>
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

        {/* Network Interfaces Card */}
        {stats?.network && stats.network.length > 0 && (
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg md:col-span-3 border border-slate-700">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <GlobeAltIcon className="w-5 h-5" /> Network Interfaces
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stats.network.map((net: any, idx: number) => (
                <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-700 text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-slate-200 text-sm">
                    <span>{net.displayName || net.name}</span>
                    <span className={net.isOperational ? 'text-emerald-400' : 'text-slate-500'}>
                      {net.isOperational ? '● Active' : '○ Inactive'}
                    </span>
                  </div>
                  <div className="text-slate-400">IPv4: <span className="text-slate-200">{net.ipv4?.length > 0 ? net.ipv4.join(', ') : 'N/A'}</span></div>
                  <div className="flex justify-between pt-1 border-t border-slate-800">
                    <span>Sent: <strong className="text-slate-300">{formatBytes(net.bytesSent)}</strong></span>
                    <span>Received: <strong className="text-slate-300">{formatBytes(net.bytesRecv)}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}