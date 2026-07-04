"use client";

import React, { useEffect, useState } from "react";
import { 
  Globe, Search, RefreshCw, AlertCircle,
  CheckCircle, XCircle, Copy, Check,
  Filter, ChevronDown, ChevronRight,
  Database, Server, Cloud, FileText, 
  Settings, Key, Mail, MapPin, Clock,
  HardDrive, Cpu, Network, Lock, Eye,
  EyeOff, ChevronUp,
  Code,
  Tag,

} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type PropertySource = {
  name: string;
  properties: Record<string, { value: string; origin?: string }>;
};

type EnvironmentData = {
  activeProfiles: string[];
  defaultProfiles: string[];
  propertySources: PropertySource[];
};

export default function EnvironmentExplorerPage() {
  const [envData, setEnvData] = useState<EnvironmentData | null>(null);
  const [filteredSources, setFilteredSources] = useState<PropertySource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());
  const [showValues, setShowValues] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const fetchEnvironment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/actuator/env`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch environment");
      }
      
      const data = await response.json();
      setEnvData(data);
      
      // Initialize expanded sources (collapse system properties by default)
      const expanded = new Set<string>();
      data.propertySources.forEach((source: PropertySource) => {
        if (!source.name.includes("systemProperties") && !source.name.includes("systemEnvironment")) {
          expanded.add(source.name);
        }
      });
      setExpandedSources(expanded);
      
      toast.success("Environment loaded successfully");
    } catch (error) {
      console.error("Error fetching environment:", error);
      toast.error("Failed to load environment from backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvironment();
  }, []);

  useEffect(() => {
    if (!envData) return;
    
    let filtered = envData.propertySources;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(source => {
        // Check source name
        if (source.name.toLowerCase().includes(searchLower)) return true;
        // Check property names
        return Object.keys(source.properties).some(key => 
          key.toLowerCase().includes(searchLower)
        );
      });
    }
    
    if (filterCategory !== "ALL") {
      filtered = filtered.filter(source => {
        if (filterCategory === "APPLICATION") {
          return source.name.includes("application.yaml") || source.name.includes("application.properties");
        }
        if (filterCategory === "SYSTEM") {
          return source.name.includes("systemProperties") || source.name.includes("systemEnvironment");
        }
        if (filterCategory === "ENV") {
          return source.name.includes("Environment");
        }
        if (filterCategory === "CONFIG") {
          return source.name.includes("Config resource");
        }
        return true;
      });
    }
    
    setFilteredSources(filtered);
  }, [searchTerm, envData, filterCategory]);

  const toggleSource = (sourceName: string) => {
    const newExpanded = new Set(expandedSources);
    if (newExpanded.has(sourceName)) {
      newExpanded.delete(sourceName);
    } else {
      newExpanded.add(sourceName);
    }
    setExpandedSources(newExpanded);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Copied to clipboard");
  };

  const getSourceIcon = (sourceName: string) => {
    if (sourceName.includes("application.yaml")) return <FileText size={16} className="text-green-500" />;
    if (sourceName.includes("systemProperties")) return <Cpu size={16} className="text-purple-500" />;
    if (sourceName.includes("systemEnvironment")) return <Cloud size={16} className="text-blue-500" />;
    if (sourceName.includes("Config resource")) return <Settings size={16} className="text-orange-500" />;
    if (sourceName.includes("devtools")) return <Code size={16} className="text-gray-500" />;
    if (sourceName.includes("server.ports")) return <Server size={16} className="text-red-500" />;
    if (sourceName.includes("dotenv")) return <FileText size={16} className="text-yellow-500" />;
    return <Database size={16} className="text-gray-500" />;
  };

  const getCategoryBadge = (sourceName: string) => {
    if (sourceName.includes("application.yaml") || sourceName.includes("application.properties")) {
      return { label: "App Config", color: "bg-green-100 text-green-700" };
    }
    if (sourceName.includes("systemProperties")) {
      return { label: "System Props", color: "bg-purple-100 text-purple-700" };
    }
    if (sourceName.includes("systemEnvironment")) {
      return { label: "Environment", color: "bg-blue-100 text-blue-700" };
    }
    if (sourceName.includes("Config resource")) {
      return { label: "Resource", color: "bg-orange-100 text-orange-700" };
    }
    if (sourceName.includes("devtools")) {
      return { label: "DevTools", color: "bg-gray-100 text-gray-700" };
    }
    return { label: "Other", color: "bg-gray-100 text-gray-700" };
  };

  const getPropertyIcon = (key: string) => {
    if (key.includes("datasource") || key.includes("database")) return <Database size={12} />;
    if (key.includes("redis")) return <Database size={12} />;
    if (key.includes("mail") || key.includes("smtp")) return <Mail size={12} />;
    if (key.includes("jwt") || key.includes("secret") || key.includes("password")) return <Key size={12} />;
    if (key.includes("cors") || key.includes("allowed")) return <Globe size={12} />;
    if (key.includes("server") || key.includes("port")) return <Server size={12} />;
    if (key.includes("management") || key.includes("actuator")) return <Settings size={12} />;
    if (key.includes("log")) return <FileText size={12} />;
    return <Settings size={12} />;
  };

  const totalProperties = envData?.propertySources.reduce(
    (acc, source) => acc + Object.keys(source.properties).length, 
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="text-white w-5 h-5" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                Environment Explorer
              </h1>
            </div>
            <p className="text-gray-500 ml-1">Inspect configuration properties and environment variables</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowValues(!showValues)}
              className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
              {showValues ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button 
              onClick={fetchEnvironment}
              className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Active Profiles" 
            value={envData?.activeProfiles?.length || 0} 
            icon={Tag}
            subtitle={envData?.activeProfiles?.join(", ") || "default"}
            color="green" 
          />
          <StatCard 
            label="Property Sources" 
            value={envData?.propertySources?.length || 0} 
            icon={Database} 
            color="blue" 
          />
          <StatCard 
            label="Total Properties" 
            value={totalProperties} 
            icon={Settings} 
            color="purple" 
          />
          <StatCard 
            label="Default Profiles" 
            value={envData?.defaultProfiles?.length || 0} 
            icon={CheckCircle} 
            subtitle={envData?.defaultProfiles?.join(", ")}
            color="orange" 
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by property name or source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              {["ALL", "APPLICATION", "SYSTEM", "ENV", "CONFIG"].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    filterCategory === category
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {category === "ALL" ? "All" : 
                   category === "APPLICATION" ? "App Config" :
                   category === "SYSTEM" ? "System" :
                   category === "ENV" ? "Environment" : "Resources"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-500">
          Showing {filteredSources.length} of {envData?.propertySources?.length || 0} property sources
        </div>

        {/* Property Sources Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            <p className="mt-4 text-gray-500">Loading environment...</p>
          </div>
        ) : filteredSources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-500 font-medium">No property sources found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSources.map((source, idx) => {
              const isExpanded = expandedSources.has(source.name);
              const category = getCategoryBadge(source.name);
              const propertyCount = Object.keys(source.properties).length;
              
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-all shadow-sm hover:shadow-md overflow-hidden"
                >
                  {/* Source Header */}
                  <button
                    onClick={() => toggleSource(source.name)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-gray-400">
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getSourceIcon(source.name)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-semibold text-gray-900 text-sm">
                            {source.name}
                          </span>
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", category.color)}>
                            {category.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({propertyCount} properties)
                          </span>
                        </div>
                        {source.name.includes("application.yaml") && (
                          <p className="text-xs text-gray-500 mt-1">
                            Main application configuration file
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {/* Properties Table */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Property
                              </th>
                              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Value
                              </th>
                              <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-10">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {Object.entries(source.properties).map(([key, prop]: [string, any]) => (
                              <tr key={key} className="hover:bg-white/50 transition-colors">
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="text-gray-400">
                                      {getPropertyIcon(key)}
                                    </div>
                                    <code className="text-xs font-mono text-gray-700">
                                      {key}
                                    </code>
                                  </div>
                                  {prop.origin && (
                                    <p className="text-[10px] text-gray-400 mt-1 font-mono">
                                      {prop.origin}
                                    </p>
                                  )}
                                </td>
                                <td className="px-5 py-3">
                                  <code className={cn(
                                    "text-xs font-mono px-2 py-1 rounded",
                                    showValues ? "bg-white text-gray-900" : "bg-gray-200 text-gray-400 blur-sm hover:blur-none transition-all"
                                  )}>
                                    {showValues ? (prop.value || "null") : "••••••••"}
                                  </code>
                                </td>
                                <td className="px-5 py-3">
                                  <button
                                    onClick={() => copyToClipboard(prop.value, key)}
                                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                                  >
                                    {copied === key ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-gray-400" />}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon: Icon, subtitle, color }: any) {
  const colorClasses = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    gray: "bg-gray-50 text-gray-600",
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className={cn("p-2 rounded-lg", )}>
          <Icon size={16} />
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      {subtitle && (
        <p className="text-[10px] text-gray-400 mt-1 font-mono truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
}