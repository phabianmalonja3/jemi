"use client";

import React, { useEffect, useState } from "react";
import { 
  Box, Search, ChevronDown, ChevronRight, 
  RefreshCw, Package, Layers, Bean, Code, 
  FileCode, Shield, Database, Zap, TrendingUp,
  AlertCircle, CheckCircle, XCircle, Info,
  Copy, Check, Filter, Grid, List,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type BeanInfo = {
  name: string;
  type: string;
  scope: string;
  resource: string;
  dependencies: string[];
  aliases: string[];
};

export default function BeansExplorerPage() {
  const [beans, setBeans] = useState<BeanInfo[]>([]);
  const [filteredBeans, setFilteredBeans] = useState<BeanInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBean, setSelectedBean] = useState<BeanInfo | null>(null);
  const [expandedBeans, setExpandedBeans] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filterScope, setFilterScope] = useState<string>("ALL");
  const [copied, setCopied] = useState<string | null>(null);

  const fetchBeans = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/actuator/beans`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch beans");
      }
      
      const data = await response.json();
      
      // Parse the nested bean structure
      const allBeans: BeanInfo[] = [];
      
      if (data.contexts) {
        Object.values(data.contexts).forEach((context: any) => {
          if (context.beans) {
            Object.entries(context.beans).forEach(([name, bean]: [string, any]) => {
              allBeans.push({
                name: name,
                type: bean.type || "Unknown",
                scope: bean.scope || "singleton",
                resource: bean.resource || "N/A",
                dependencies: bean.dependencies || [],
                aliases: bean.aliases || []
              });
            });
          }
        });
      }
      
      setBeans(allBeans);
      setFilteredBeans(allBeans);
      toast.success(`Loaded ${allBeans.length} Spring Beans`);
    } catch (error) {
      console.error("Error fetching beans:", error);
      toast.error("Failed to load beans from backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeans();
    const interval = setInterval(fetchBeans, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = beans;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(bean => 
        bean.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bean.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply scope filter
    if (filterScope !== "ALL") {
      filtered = filtered.filter(bean => bean.scope === filterScope);
    }
    
    setFilteredBeans(filtered);
  }, [searchTerm, beans, filterScope]);

  const toggleBean = (beanName: string) => {
    const newExpanded = new Set(expandedBeans);
    if (newExpanded.has(beanName)) {
      newExpanded.delete(beanName);
    } else {
      newExpanded.add(beanName);
    }
    setExpandedBeans(newExpanded);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Copied to clipboard");
  };

  const getScopeBadgeColor = (scope: string) => {
    switch (scope) {
      case "singleton":
        return "bg-green-100 text-green-700 border-green-200";
      case "prototype":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "request":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "session":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getBeanIcon = (beanName: string) => {
    if (beanName.toLowerCase().includes("controller")) return <Zap size={16} />;
    if (beanName.toLowerCase().includes("service")) return <Package size={16} />;
    if (beanName.toLowerCase().includes("repository")) return <Database size={16} />;
    if (beanName.toLowerCase().includes("config")) return <Settings size={16} />;
    if (beanName.toLowerCase().includes("mapper")) return <Code size={16} />;
    return <Bean size={16} />;
  };

  const stats = {
    total: beans.length,
    singletons: beans.filter(b => b.scope === "singleton").length,
    prototypes: beans.filter(b => b.scope === "prototype").length,
    controllers: beans.filter(b => b.name.toLowerCase().includes("controller")).length,
    services: beans.filter(b => b.name.toLowerCase().includes("service")).length,
    repositories: beans.filter(b => b.name.toLowerCase().includes("repository")).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Box className="text-white w-5 h-5" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                Spring Beans Explorer
              </h1>
            </div>
            <p className="text-gray-500 ml-1">Inspect and analyze all Spring managed beans in Jemigraph Engine</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchBeans}
              className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard label="Total Beans" value={stats.total} icon={Box} color="green" />
          <StatCard label="Singletons" value={stats.singletons} icon={CheckCircle} color="blue" />
          <StatCard label="Prototypes" value={stats.prototypes} icon={Layers} color="purple" />
          <StatCard label="Controllers" value={stats.controllers} icon={Zap} color="orange" />
          <StatCard label="Services" value={stats.services} icon={Package} color="indigo" />
          <StatCard label="Repositories" value={stats.repositories} icon={Database} color="red" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by bean name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              {["ALL", "singleton", "prototype"].map((scope) => (
                <button
                  key={scope}
                  onClick={() => setFilterScope(scope)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    filterScope === scope
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {scope.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  viewMode === "list" ? "bg-green-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                )}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  viewMode === "grid" ? "bg-green-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                )}
              >
                <Grid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-500">
          Found {filteredBeans.length} of {beans.length} beans
        </div>

        {/* Beans Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            <p className="mt-4 text-gray-500">Loading beans...</p>
          </div>
        ) : filteredBeans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <p className="text-gray-500 font-medium">No beans found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-3">
            {filteredBeans.map((bean) => (
              <div
                key={bean.name}
                className="bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-all shadow-sm hover:shadow-md"
              >
                <button
                  onClick={() => toggleBean(bean.name)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-gray-400">
                      {expandedBeans.has(bean.name) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                      {getBeanIcon(bean.name)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-semibold text-gray-900 text-sm">
                          {bean.name}
                        </span>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", getScopeBadgeColor(bean.scope))}>
                          {bean.scope}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-mono truncate max-w-2xl">
                        {bean.type}
                      </p>
                    </div>
                  </div>
                </button>
                
                {expandedBeans.has(bean.name) && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Type */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <Code size={10} /> Bean Type
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 flex-1 break-all">
                            {bean.type}
                          </code>
                          <button
                            onClick={() => copyToClipboard(bean.type, `type-${bean.name}`)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            {copied === `type-${bean.name}` ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-gray-400" />}
                          </button>
                        </div>
                      </div>
                      
                      {/* Resource */}
                      {bean.resource !== "N/A" && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <FileCode size={10} /> Resource Location
                          </label>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 flex-1 break-all">
                              {bean.resource}
                            </code>
                            <button
                              onClick={() => copyToClipboard(bean.resource, `resource-${bean.name}`)}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              {copied === `resource-${bean.name}` ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-gray-400" />}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Dependencies */}
                      {bean.dependencies.length > 0 && (
                        <div className="lg:col-span-2 space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            {/* <Link size={10} /> Dependencies ({bean.dependencies.length}) */}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {bean.dependencies.map((dep: string) => (
                              <span
                                key={dep}
                                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-mono border border-blue-200"
                              >
                                {dep}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Aliases */}
                      {bean.aliases.length > 0 && (
                        <div className="lg:col-span-2 space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Aliases</label>
                          <div className="flex flex-wrap gap-2">
                            {bean.aliases.map((alias: string) => (
                              <span
                                key={alias}
                                className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-mono border border-purple-200"
                              >
                                {alias}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBeans.map((bean) => (
              <div
                key={bean.name}
                className="bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                onClick={() => setSelectedBean(bean)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                      {getBeanIcon(bean.name)}
                    </div>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", getScopeBadgeColor(bean.scope))}>
                      {bean.scope}
                    </span>
                  </div>
                  <h3 className="font-mono font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                    {bean.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono line-clamp-2">
                    {bean.type}
                  </p>
                  {bean.dependencies.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-[10px] text-gray-400">
                        {bean.dependencies.length} dependenc{bean.dependencies.length === 1 ? 'y' : 'ies'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bean Detail Modal */}
      {selectedBean && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBean(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <Bean size={18} />
                </div>
                <h2 className="font-bold text-gray-900">Bean Details</h2>
              </div>
              <button
                onClick={() => setSelectedBean(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Bean Name</label>
                <p className="font-mono text-sm font-semibold text-gray-900 mt-1">{selectedBean.name}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Bean Type</label>
                <p className="font-mono text-xs text-gray-700 mt-1 break-all bg-gray-50 p-3 rounded-lg">{selectedBean.type}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Scope</label>
                <p className="mt-1">
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium border inline-block", getScopeBadgeColor(selectedBean.scope))}>
                    {selectedBean.scope}
                  </span>
                </p>
              </div>
              {selectedBean.resource !== "N/A" && (
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Resource</label>
                  <p className="font-mono text-xs text-gray-700 mt-1 break-all bg-gray-50 p-3 rounded-lg">{selectedBean.resource}</p>
                </div>
              )}
              {selectedBean.dependencies.length > 0 && (
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Dependencies ({selectedBean.dependencies.length})</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedBean.dependencies.map((dep) => (
                      <span key={dep} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-mono border border-blue-200">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon: Icon, color }: any) {
  const colorClasses = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    indigo: "bg-indigo-50 text-indigo-600",
    red: "bg-red-50 text-red-600",
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-2">
        <div className={cn("p-2 rounded-lg")}>
          <Icon size={16} />
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
    </div>
  );
}