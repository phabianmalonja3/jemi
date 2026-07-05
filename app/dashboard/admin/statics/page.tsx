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



  

  


return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-6">
    <div className="max-w-2xl w-full text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Server className="text-green-600 w-12 h-12" />
      </div>
      <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
         Coming Soon
      </h1>
      <p className="text-lg text-gray-600 mt-4 max-w-md mx-auto">
        The <span className="font-bold text-green-600">Jemigraph </span> This dashboard is currently under .
        We are preparing a powerful management interface for you.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <div className="px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 font-semibold flex items-center justify-center gap-2">
          <Clock size={18} />
          Estimated launch: Q2 2025
        </div>
       
      </div>
      <p className="text-sm text-gray-400 mt-8">
        © {new Date().getFullYear()} Jemigraph · All rights reserved
      </p>
    </div>
  </div>
);


}

