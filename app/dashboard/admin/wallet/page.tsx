"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, 
  ShieldCheck, 
  History, 
  Loader2, 
  RefreshCw,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  PiggyBank,
  Banknote,
  Percent,
  Coins,
  Receipt
} from "lucide-react";
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

interface CommissionTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  createdAt: string;
  source: string;
  referenceId?: string;
  bookingId?: string;
  photographerId?: string;
  commissionRate?: number;
}

interface WalletSummary {
  totalRevenue: number;
  pendingRevenue: number;
  totalTransactions: number;
  totalCommission: number;
  averageCommission: number;
  monthlyStats: {
    month: string;
    revenue: number;
    transactions: number;
  }[];
}

export default function SystemWalletPage() {
  const [transactions, setTransactions] = useState<CommissionTransaction[]>([]);
  const [summary, setSummary] = useState<WalletSummary>({
    totalRevenue: 0,
    pendingRevenue: 0,
    totalTransactions: 0,
    totalCommission: 0,
    averageCommission: 0,
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filterType, setFilterType] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'FAILED'>('ALL');
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

  useEffect(() => {
    fetchWalletData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWalletData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchWalletData = async (isBackground: boolean = false) => {
    if (!isBackground) {
      setLoading(true);
    } else {
      setIsSyncing(true);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        setLoading(false);
        setIsSyncing(false);
        return;
      }

      // Build query parameters for transactions
      const params = new URLSearchParams();
      params.append("page", String(currentPage));
      params.append("size", String(pageSize));
      params.append("sort", `createdAt,${sortDirection}`);

      if (searchTerm) {
        params.append("search", searchTerm);
      }
      
      if (filterType !== "ALL") {
        params.append("type", filterType);
      }
      
      if (filterStatus !== "ALL") {
        params.append("status", filterStatus);
      }

      // Fetch from /admin/system-wallet-summary (new endpoint)
      const response = await apiClient.get(
        `/admin/system-wallet-summary?${params.toString()}`
      );
      
      const data = response.data;
      
      // Set summary data
      setSummary({
        totalRevenue: data.totalRevenue || 0,
        pendingRevenue: data.pendingRevenue || 0,
        totalTransactions: data.totalTransactions || 0,
        totalCommission: data.totalCommission || 0,
        averageCommission: data.averageCommission || 0,
        monthlyStats: data.monthlyStats || []
      });
      
      // Set transactions
      setTransactions(data.transactions || []);
      setTotalPages(data.totalPages || 1);
      
      if (!isBackground) {
        toast.success(`Loaded ${data.transactions?.length || 0} commission transactions`);
      }
    } catch (error: any) {
      console.error("Error fetching wallet data:", error);
      if (!isBackground) {
        toast.error(error.response?.data?.message || "Failed to load wallet data");
      }
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      fetchWalletData();
    }
  };

  const handleRefresh = () => {
    fetchWalletData();
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      toast.loading("Exporting wallet data...");
      
      const response = await apiClient.get('/admin/system-wallet/export', {
        params: {
          search: searchTerm || undefined,
          type: filterType !== "ALL" ? filterType : undefined,
          status: filterStatus !== "ALL" ? filterStatus : undefined,
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `system_wallet_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.dismiss();
      toast.success("Wallet data exported successfully!");
    } catch (error: any) {
      console.error("Error exporting wallet data:", error);
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to export data");
    }
  };

  // Calculate statistics from transactions
  const totalCredits = transactions
    .filter(t => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const completedCount = transactions.filter(t => t.status === 'COMPLETED').length;
  const pendingCount = transactions.filter(t => t.status === 'PENDING').length;
  const failedCount = transactions.filter(t => t.status === 'FAILED').length;

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-emerald-600" size={40} />
          <p className="text-slate-500 font-medium">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <Wallet className="text-emerald-600" size={24} />
            </div>
            System Wallet
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Platform commission management • {summary.totalTransactions} total transactions
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isSyncing && (
            <span className="text-xs text-emerald-600 flex items-center gap-1 px-3 py-2 bg-emerald-50 rounded-xl">
              <Loader2 size={14} className="animate-spin" />
              Syncing...
            </span>
          )}
          
          <button 
            onClick={handleRefresh}
            className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-all"
            disabled={loading || isSyncing}
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          <button 
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Main Balance Card - Salio la System */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-gradient-to-br from-emerald-900 to-emerald-700 p-6 lg:p-8 rounded-2xl text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 opacity-90 mb-2">
                <ShieldCheck size={20} className="text-emerald-300" />
                <span className="text-sm font-medium">Total System Revenue</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold">
                Tsh {summary.totalRevenue.toFixed(2)}
              </h1>
              <p className="text-emerald-200/80 text-sm mt-2">
                Total commission earned from all bookings (10% of each booking)
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
              <PiggyBank className="text-emerald-300" size={32} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
            <div>
              <p className="text-xs text-emerald-200/80">Commission Rate</p>
              <p className="text-lg font-semibold text-white">
                10%
              </p>
              <p className="text-xs text-emerald-300/60">per completed booking</p>
            </div>
            <div>
              <p className="text-xs text-emerald-200/80">Total Transactions</p>
              <p className="text-lg font-semibold text-white">
                {summary.totalTransactions}
              </p>
              <p className="text-xs text-emerald-300/60">commission payments</p>
            </div>
          </div>
        </div>

        {/* Commission Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Percent size={16} className="text-emerald-600" />
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Total Commission</p>
            </div>
            <p className="text-xl font-bold text-emerald-600">Tsh {summary.totalCommission.toFixed(2)}</p>
            <p className="text-[10px] text-slate-400">{transactions.filter(t => t.type === 'CREDIT').length} transactions</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Banknote size={16} className="text-blue-600" />
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Avg Commission</p>
            </div>
            <p className="text-xl font-bold text-blue-600">Tsh {summary.averageCommission.toFixed(2)}</p>
            <p className="text-[10px] text-slate-400">per transaction</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Completed</p>
            <p className="text-xl font-bold text-emerald-600">{completedCount}</p>
            <p className="text-[10px] text-slate-400">{((completedCount/transactions.length)*100 || 0).toFixed(0)}%</p>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Pending</p>
            <p className="text-xl font-bold text-amber-600">{pendingCount}</p>
            <p className="text-[10px] text-slate-400">{((pendingCount/transactions.length)*100 || 0).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* How Commission Works - Info Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-200 rounded-lg">
            <Receipt size={20} className="text-emerald-700" />
          </div>
          <div>
            <h4 className="font-semibold text-emerald-900 text-sm">How System Commission Works</h4>
            <p className="text-emerald-700/80 text-xs mt-1">
              When a booking is fully paid (100%), the system automatically deducts 10% as platform fee.
              The remaining 90% is released to the photographer's available balance.
              All commission transactions are tracked here for transparency.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="CREDIT">💰 Commission</option>
            <option value="DEBIT">💳 Debit</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="COMPLETED">✅ Completed</option>
            <option value="PENDING">⏳ Pending</option>
            <option value="FAILED">❌ Failed</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              fetchWalletData();
            }}
            className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>

          <button
            onClick={() => {
              const newSort = sortDirection === 'DESC' ? 'ASC' : 'DESC';
              setSortDirection(newSort);
              fetchWalletData();
            }}
            className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            {sortDirection === 'DESC' ? 'Newest' : 'Oldest'}
          </button>
        </div>
      </div>

      {/* Transactions Table - Commission History */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <History size={18} className="text-emerald-600" />
            Commission Transactions
          </h2>
          <span className="text-xs text-slate-400">
            {transactions.length} transactions
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-600 text-left">Description</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-600 text-center">Type</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-600 text-right">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-600 text-center">Status</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase text-slate-600 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Wallet className="mx-auto text-slate-300 mb-3" size={48} />
                    <p className="text-slate-500 font-medium">No commission transactions found</p>
                    <p className="text-slate-400 text-sm mt-1">The system wallet is empty</p>
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{t.description}</p>
                        {t.referenceId && (
                          <p className="text-xs text-slate-400 font-mono">Ref: {t.referenceId}</p>
                        )}
                        {t.bookingId && (
                          <p className="text-xs text-slate-400">Booking: #{t.bookingId}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700">
                        <ArrowUpRight size={12} />
                        Commission
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">
                      +Tsh {t.amount.toFixed(2)}
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
                        <span className="text-sm text-slate-700">
                          {new Date(t.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(t.createdAt).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {transactions.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
            <span className="text-sm text-slate-500">
              Page {currentPage + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 0 || loading}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                disabled={currentPage + 1 >= totalPages || loading}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Stats */}
      {summary.monthlyStats && summary.monthlyStats.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-emerald-600" />
            Monthly Commission Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {summary.monthlyStats.map((stat, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-xs text-slate-500 font-medium">{stat.month}</p>
                <p className="text-lg font-bold text-emerald-600">Tsh {stat.revenue.toFixed(2)}</p>
                <p className="text-xs text-slate-400">{stat.transactions} txns</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}