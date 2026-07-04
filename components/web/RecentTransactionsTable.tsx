"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { DollarSign, AlertCircle, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  userName: string;      // Imebadilishwa kutoka 'name'
  amount: number;        // Imebadilishwa kutoka 'string'
  type: string;
  status: "COMPLETED" | "PENDING" | "FAILED"; // Imebadilishwa kulingana na enum
  referenceId: string;
  createdAt: string;     // Imebadilishwa kutoka 'date'
}

interface Props {
  onViewAll?: () => void;
}

export default function RecentTransactionsTable({ onViewAll }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Hii useEffect ndio inaita kazi ya kufetch data wakati component inapoload
  useEffect(() => {
    fetchRecentTransactions();
    const interval = setInterval(fetchRecentTransactions, 30000);
  return () => clearInterval(interval);
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/transactions/recent`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch recent transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Loading state: Inaonyesha loader wakati data bado inakuja
  if (loading) {
    return (
      <div className="bg-white p-10 rounded-2xl text-center border border-slate-200">
        <Loader2 className="animate-spin mx-auto text-emerald-600" size={32} />
      </div>
    );
  }

  // 3. Render ya kawaida
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
          <p className="text-xs text-slate-400 mt-1">Latest financial activity</p>
        </div>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View All <ChevronRight size={14} />
          </button>
        )}
      </div>
      
      <div className="divide-y divide-slate-100">
        {transactions.length === 0 ? (
          <p className="p-6 text-sm text-slate-400 text-center">No recent transactions.</p>
        ) : (
          transactions.map((tx) => (
        
<div key={tx.id} className="p-5 hover:bg-slate-50 transition-colors">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
      
        {tx.status === "COMPLETED" ? (
          <DollarSign size={18} className="text-emerald-600" />
        ) : (
          <AlertCircle size={18} className="text-amber-600" />
        )}
      </div>
      <div>
        {/* Imebadilishwa kuwa userName */}
        <p className="font-semibold text-base text-slate-900">{tx.userName}</p>
        <p className="text-xs text-slate-400">{tx.type} • Ref: {tx.referenceId}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={cn("font-bold text-base", tx.status === "COMPLETED" ? "text-emerald-600" : "text-amber-600")}>
        Tsh {tx.amount.toLocaleString()}
      </p>
      <p className="text-[10px] text-slate-400">
        {/* Imebadilishwa kuwa createdAt */}
        {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </p>
    </div>
  </div>
</div>
          ))
        )}
      </div>
    </div>
  );
}