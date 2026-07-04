"use client";

import { useState, useEffect } from "react";
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Receipt, 
  Loader2, 
  RefreshCw, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Transaction } from "@/lib/models/transactions";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v0.1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => window.location.href = "/auth/login", 2000);
    }
    return Promise.reject(error);
  }
);

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'ALL' | 'DEBIT' | 'CREDIT'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED'>('ALL');
  const [pageSize, setPageSize] = useState(10);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTransactions(currentPage, sortDirection, true);
    }, 30000);
    return () => clearInterval(interval);
  }, [currentPage, sortDirection, searchTerm, filterType, filterStatus]);

  // Initial fetch
  useEffect(() => {
    fetchTransactions(0);
  }, []);

  // Fetch when filters change (debounced)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTransactions(0, sortDirection);
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterType, filterStatus]);

  const fetchTransactions = async (
    page: number, 
    sort: string = sortDirection, 
    isBackground: boolean = false
  ) => {
    if (!isBackground) {
      setLoading(true);
    } else {
      setIsSyncing(true);
    }
    
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required");
      setLoading(false);
      setIsSyncing(false);
      return;
    }

    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("size", String(pageSize));
      params.append("sort", `createdAt,${sort}`);

      // Apply filters
      if (searchTerm) {
        params.append("userName", searchTerm);
      }
      
      if (filterType !== "ALL") {
        params.append("type", filterType);
      }
      
      if (filterStatus !== "ALL") {
        params.append("status", filterStatus);
      }

      const response = await apiClient.get(
        `/admin/transactions?${params.toString()}`
      );

      setTransactions(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setCurrentPage(page);
      
      if (!isBackground) {
        toast.success(`Loaded ${response.data.content.length} transactions`);
      }
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      if (!isBackground) {
        toast.error(error.response?.data?.message || "Failed to load transactions.");
      }
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchTransactions(newPage, sortDirection);
    }
  };

  const handleSortToggle = () => {
    const newSort = sortDirection === 'DESC' ? 'ASC' : 'DESC';
    setSortDirection(newSort);
    fetchTransactions(0, newSort);
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      toast.loading("Exporting transactions...");
      
      const response = await apiClient.get('/admin/transactions/export', {
        params: {
          userName: searchTerm || undefined,
          type: filterType !== "ALL" ? filterType : undefined,
          status: filterStatus !== "ALL" ? filterStatus : undefined,
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.dismiss();
      toast.success("Transactions exported successfully!");
    } catch (error: any) {
      console.error("Error exporting transactions:", error);
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to export transactions");
    }
  };

  // Calculate statistics
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + t.amount, 0);
  const totalCredit = transactions.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0);
  const completedCount = transactions.filter(t => t.status === 'COMPLETED').length;
  const pendingCount = transactions.filter(t => t.status === 'PENDING').length;
  const failedCount = transactions.filter(t => t.status === 'FAILED').length;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <Receipt className="text-emerald-600" size={24} />
            </div>
            Transaction History
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {totalElements} total transactions • Page {currentPage + 1} of {totalPages}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Auto-sync indicator */}
          {isSyncing && (
            <span className="text-xs text-emerald-600 flex items-center gap-1 px-3 py-2 bg-emerald-50 rounded-xl">
              <Loader2 size={14} className="animate-spin" />
              Syncing...
            </span>
          )}
          
          {/* Refresh Button */}
          <button 
            onClick={() => fetchTransactions(currentPage, sortDirection)}
            className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-all disabled:opacity-50"
            disabled={loading || isSyncing}
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          
          {/* Sort Button */}
          <button 
            onClick={handleSortToggle}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 flex items-center gap-2 transition-all"
          >
            <ArrowUpDown size={16} /> 
            {sortDirection === 'DESC' ? 'Newest First' : 'Oldest First'}
          </button>

          {/* Export Button */}
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3">
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Total</p>
          <p className="text-lg font-bold text-slate-900">${totalAmount.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400">{transactions.length} txns</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3">
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Debit</p>
          <p className="text-lg font-bold text-emerald-600">${totalDebit.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400">{transactions.filter(t => t.type === 'DEBIT').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3">
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Credit</p>
          <p className="text-lg font-bold text-rose-600">${totalCredit.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400">{transactions.filter(t => t.type === 'CREDIT').length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3">
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Completed</p>
          <p className="text-lg font-bold text-emerald-600">{completedCount}</p>
          <p className="text-[10px] text-slate-400">{((completedCount/transactions.length)*100 || 0).toFixed(0)}%</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3">
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Pending</p>
          <p className="text-lg font-bold text-amber-600">{pendingCount}</p>
          <p className="text-[10px] text-slate-400">{((pendingCount/transactions.length)*100 || 0).toFixed(0)}%</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3">
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Failed</p>
          <p className="text-lg font-bold text-rose-600">{failedCount}</p>
          <p className="text-[10px] text-slate-400">{((failedCount/transactions.length)*100 || 0).toFixed(0)}%</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by user name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200 px-4 py-2.5 pr-8 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer min-w-[120px]"
            >
              <option value="ALL">All Types</option>
              <option value="DEBIT">💳 Debit</option>
              <option value="CREDIT">💰 Credit</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200 px-4 py-2.5 pr-8 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer min-w-[140px]"
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">✅ Completed</option>
              <option value="PENDING">⏳ Pending</option>
              <option value="FAILED">❌ Failed</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              fetchTransactions(0, sortDirection);
            }}
            className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-600 tracking-wider w-[30%]">User</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-600 tracking-wider w-[15%]">Type</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-600 text-right tracking-wider w-[15%]">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-600 text-center tracking-wider w-[15%]">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-600 tracking-wider w-[25%]">Date/Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-emerald-600" size={24} />
                      <p className="text-slate-500 font-medium">Loading transactions...</p>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Receipt className="mx-auto text-slate-300 mb-3" size={48} />
                    <p className="text-slate-500 font-medium">No transactions found</p>
                    <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <>
                    <tr 
                      key={t.id} 
                      onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button className="text-slate-400 group-hover:text-slate-600 transition-colors">
                            {expandedId === t.id ? 
                              <ChevronUp size={16} /> : 
                              <ChevronDown size={16} />
                            }
                          </button>
                          <div>
                            <p className="font-semibold text-slate-900">{t.userName}</p>
                            {/* <p className="text-xs text-slate-400">{t.userEmail}</p> */}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold",
                          t.type === 'DEBIT' 
                            ? "bg-emerald-50 text-emerald-700" 
                            : "bg-rose-50 text-rose-700"
                        )}>
                          {t.type === 'DEBIT' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                          {t.type}
                        </span>
                      </td>
                      <td className={cn(
                        "px-6 py-4 text-right font-bold",
                        t.type === 'DEBIT' ? "text-emerald-600" : "text-rose-600"
                      )}>
                        ${t.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold",
                          t.status === 'COMPLETED' && "bg-emerald-50 text-emerald-700",
                          t.status === 'PENDING' && "bg-amber-50 text-amber-700",
                          t.status === 'FAILED' && "bg-rose-50 text-rose-700"
                        )}>
                          {t.status === 'COMPLETED' && <CheckCircle size={12} />}
                          {t.status === 'PENDING' && <AlertCircle size={12} />}
                          {t.status === 'FAILED' && <XCircle size={12} />}
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-700 flex items-center gap-1">
                            <Calendar size={12} className="text-slate-400" />
                            {new Date(t.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock size={12} className="text-slate-400" />
                            {new Date(t.createdAt).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded Details Row */}
                    {expandedId === t.id && (
                      <tr className="bg-slate-50/70">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-xs text-slate-500 font-medium">Transaction ID</p>
                              <p className="text-slate-700 font-mono text-xs mt-1 break-all">{t.id}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-medium">User</p>
                              <p className="text-slate-700 mt-1">{t.userName}</p>
                              {/* <p className="text-xs text-slate-400">{t.userEmail}</p> */}
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-medium">Amount & Type</p>
                              <p className={cn(
                                "font-bold mt-1",
                                t.type === 'DEBIT' ? "text-emerald-600" : "text-rose-600"
                              )}>
                                {t.type} ${t.amount.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-medium">Status</p>
                              <span className={cn(
                                "inline-flex px-2 py-0.5 rounded-lg text-xs font-bold mt-1",
                                t.status === 'COMPLETED' && "bg-emerald-100 text-emerald-700",
                                t.status === 'PENDING' && "bg-amber-100 text-amber-700",
                                t.status === 'FAILED' && "bg-rose-100 text-rose-700"
                              )}>
                                {t.status}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
          <div className="text-sm text-slate-500">
            Showing {transactions.length} of {totalElements} transactions
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0 || loading}
              className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i;
                if (totalPages > 5) {
                  const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
                  pageNum = start + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                      currentPage === pageNum
                        ? "bg-emerald-600 text-white"
                        : "hover:bg-white text-slate-600"
                    )}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1 || loading}
              className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}