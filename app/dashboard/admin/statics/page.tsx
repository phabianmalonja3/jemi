"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Database, HardDrive, Mail, Zap, 
  ShieldCheck, Activity, RefreshCw, AlertCircle,
  Clock, Server, Lock, Globe, ListTree, Terminal,
  ChevronRight, Box, Settings, CheckCircle, XCircle,
  Cpu, Network, Code, FileCode, Fingerprint
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { apiClient } from "@/lib/actions";

// --- Helper Functions ---
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function CompleteSystemDashboard() {
  const router = useRouter();
  const [healthData, setHealthData] = useState<any>(null);
  const [links, setLinks] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Health Data
      const healthRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/actuator/health`, { cache: 'no-store' });

      const health = await healthRes.json();
      setHealthData(health);
  
      if (!healthRes.ok) throw new Error("Health check failed");
      

      // 2. Fetch All Actuator Links
      const linksRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/actuator`, { cache: 'no-store' });
      if (!linksRes.ok) throw new Error("Links fetch failed");
      const linksData = await linksRes.json();
      setLinks(linksData._links);

      setError(null);
      setLastUpdated(new Date());
      toast.success("System data refreshed");
    } catch (err) {
      setError("Backend server haipatikani. Hakikisha Spring Boot engine v0.1 inafanya kazi.");
      toast.error("Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const navigateToExplorer = (path: string) => {
    router.push(`/dashboard/admin/statics/${path}`);
  };

  if (loading && !healthData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <Cpu className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600 w-6 h-6" />
        </div>
        <p className="font-bold text-gray-600 mt-6">Loading Jemigraph Control Center...</p>
        <p className="text-sm text-gray-400 mt-1">Initializing system components</p>
      </div>
    );
  }

  if (error && !healthData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="text-red-500" size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Connection Failed</h2>
        <p className="text-gray-500 mt-2 max-w-md">{error}</p>
        <button 
          onClick={fetchData} 
          className="mt-8 px-8 py-3.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    );
  }

  const { components } = healthData || { components: {} };

  const explorerLinks = [
    { 
      key: 'beans', 
      label: 'Spring Beans', 
      icon: Box, 
      desc: 'Context Objects & Dependencies', 
      color: 'text-blue-600 bg-blue-50',
      path: 'beans'
    },
    { 
      key: 'mappings', 
      label: 'API Routes', 
      icon: ListTree, 
      desc: 'All Endpoint Mappings', 
      color: 'text-green-600 bg-green-50',
      path: 'mappings'
    },
    { 
      key: 'configprops', 
      label: 'Configuration', 
      icon: Settings, 
      desc: 'Active Properties', 
      color: 'text-purple-600 bg-purple-50',
      path: 'configprops'
    },
    { 
      key: 'env', 
      label: 'Environment', 
      icon: Terminal, 
      desc: 'System Variables', 
      color: 'text-orange-600 bg-orange-50',
      path: 'env'
    },
    { 
      key: 'scheduledtasks', 
      label: 'Scheduled Tasks', 
      icon: Clock, 
      desc: 'Cron & Background Jobs', 
      color: 'text-pink-600 bg-pink-50',
      path: 'scheduledtasks'
    },
    { 
      key: 'metrics', 
      label: 'Metrics', 
      icon: Activity, 
      desc: 'Performance Data', 
      color: 'text-indigo-600 bg-indigo-50',
      path: 'metrics'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Server className="text-white w-5 h-5" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                JEMIGRAPH <span className="text-green-600">ENGINE</span>
              </h1>
            </div>
            <p className="text-gray-500 font-medium ml-1">Infrastructure & API Management Console</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-white border shadow-sm",
              healthData?.status === "UP" ? "border-green-200 text-green-700" : "border-red-200 text-red-700"
            )}>
              <div className={cn("w-2 h-2 rounded-full", healthData?.status === "UP" ? "bg-green-500 animate-pulse" : "bg-red-500")} />
              STATUS: {healthData?.status || "UNKNOWN"}
            </div>
            <button 
              onClick={fetchData} 
              className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Critical Infrastructure Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-green-600 rounded-full" />
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Critical Infrastructure</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* <ComponentCard 
              title="PostgreSQL" 
              status={components.db?.status} 
              value={components.db?.details?.database || "jemigraph_db"} 
              detail="Primary Database" 
              icon={Database} 
              gradient="from-blue-600 to-blue-700"
              bgGradient="from-blue-50 to-blue-100"
            /> */}
            <ComponentCard 
              title="Disk Space" 
              status={components.diskSpace?.status} 
              value={formatBytes(components.diskSpace?.details?.free)} 
              detail={`of ${formatBytes(components.diskSpace?.details?.total)}`} 
              icon={HardDrive} 
              gradient="from-amber-600 to-amber-700"
              bgGradient="from-amber-50 to-amber-100"
            />
            <ComponentCard 
              title="Redis Cache" 
              status={components.redis?.status} 
              value={`v${components.redis?.details?.version || "6.2"}`} 
              detail="Cache Store" 
              icon={Zap} 
              gradient="from-red-600 to-red-700"
              bgGradient="from-red-50 to-red-100"
            />
            <ComponentCard 
              title="Mail Relay" 
              status={components.mail?.status} 
              value="SMTP Active" 
              detail={components.mail?.details?.location || "mail.jemigraph.com"} 
              icon={Mail} 
              gradient="from-indigo-600 to-indigo-700"
              bgGradient="from-indigo-50 to-indigo-100"
            />
          </div>
        </section>

        {/* System Explorer Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-green-600 rounded-full" />
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Developer Explorer</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {explorerLinks.map((item) => (
              <button
                key={item.key}
                onClick={() => navigateToExplorer(item.path)}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5 overflow-hidden text-left w-full cursor-pointer"
              >
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl transition-all duration-300 group-hover:scale-110", item.color)}>
                      <item.icon size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">{item.label}</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="h-0.5 bg-gradient-to-r from-green-600 to-transparent w-0 group-hover:w-full transition-all duration-500" />
              </button>
            ))}
          </div>
        </section>

        {/* Lower Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Security Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-600" />
                Security & Integrity
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <StatusRow 
                  label="SSL Certificate" 
                  status={components.ssl?.status || "UP"} 
                  icon={Lock} 
                />
                <StatusRow 
                  label="Liveness State" 
                  status={components.livenessState?.status || "UP"} 
                  icon={Activity} 
                />
                <StatusRow 
                  label="Readiness State" 
                  status={components.readinessState?.status || "UP"} 
                  icon={Clock} 
                />
                <StatusRow 
                  label="Application Ping" 
                  status={components.ping?.status || "UP"} 
                  icon={Globe} 
                />
              </div>
            </div>
          </div>

          {/* Project Context Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Server size={18} className="text-green-400" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Project Context</h2>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
                  <FileCode size={10} />
                  Working Directory
                </p>
                <p className="text-xs font-mono text-green-400 break-all bg-gray-800/50 p-3 rounded-xl border border-gray-700">
                  {components.diskSpace?.details?.path || "/opt/jemigraph/engine"}
                </p>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-gray-700 pt-4">
                <span className="text-gray-400">Active Endpoints</span>
                <span className="font-bold text-green-400">{links ? Object.keys(links).length : 0} routes</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Java Version</span>
                <span className="font-mono text-gray-300">17 LTS</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Spring Boot</span>
                <span className="font-mono text-gray-300">3.2.x</span>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <p className="text-[10px] text-gray-500 flex items-center gap-2">
                  <Clock size={10} />
                  Last Sync: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 text-center border-t border-gray-200">
          <p className="text-xs text-gray-400">
            © 2024 Jemigraph Engine v0.1 | Spring Boot Actuator Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}

// Component Card Component
function ComponentCard({ title, status, value, detail, icon: Icon, gradient, bgGradient }: any) {
  const isUp = status === "UP";
  
  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-3 rounded-xl bg-gradient-to-br shadow-sm", bgGradient || "from-gray-50 to-gray-100")}>
            <Icon size={22} className="text-gray-700" />
          </div>
          <div className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1",
            isUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", isUp ? "bg-green-500 animate-pulse" : "bg-red-500")} />
            {status || "OFF"}
          </div>
        </div>
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</h3>
        <p className="text-xl font-black text-gray-900 mt-1">{value || "N/A"}</p>
        <p className="text-[11px] text-gray-400 mt-2 font-medium">{detail}</p>
      </div>
      <div className={cn("h-0.5 w-0 group-hover:w-full transition-all duration-500", isUp ? "bg-gradient-to-r from-green-600 to-green-400" : "bg-gradient-to-r from-red-600 to-red-400")} />
    </div>
  );
}

// Status Row Component
function StatusRow({ label, status, icon: Icon }: any) {
  const isUp = status === "UP";
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200">
      <div className="flex items-center gap-3">
        <div className={cn("p-1.5 rounded-lg", isUp ? "text-green-600" : "text-red-600")}>
          <Icon size={15} />
        </div>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn("text-[11px] font-bold", isUp ? "text-green-600" : "text-red-600")}>
          {status}
        </span>
        {isUp ? (
          <CheckCircle size={14} className="text-green-500" />
        ) : (
          <XCircle size={14} className="text-red-500" />
        )}
      </div>
    </div>
  );
}