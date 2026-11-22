
"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  CurrencyDollar,
  Wallet,
  CheckCircle,
  Clock,
  XCircle,
  ArrowClockwise,
  MagnifyingGlass,
  TrendUp,
  Receipt,
  CalendarBlank,
} from "@phosphor-icons/react";

interface Transaction {
  id: string;
  orderId: string;
  transactionNumber: string;
  referenceNumber: string;
  receiptNumber?: string | null;
  provider?: string | null;
  userId: string;
  planId: string;
  amount: number;
  phoneNumber: string;
  status: string;
  gatewayResponse?: string;
  createdAt: string;
  callbackProcessed: boolean;
}

export default function SalesRevenuePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setTransactions(
        Array.isArray(data) ? data : data.content || []
      );
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error("Failed to load revenue data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const stats = useMemo(() => {
    const successful = transactions.filter(
      (tx) => tx.status?.toUpperCase() === "SUCCESS"
    );

    const pending = transactions.filter(
      (tx) => tx.status?.toUpperCase() === "PENDING"
    );

    const failed = transactions.filter(
      (tx) => tx.status?.toUpperCase() === "FAILED"
    );

    const totalRevenue = successful.reduce(
      (sum, tx) => sum + Number(tx.amount || 0),
      0
    );

    const pendingAmount = pending.reduce(
      (sum, tx) => sum + Number(tx.amount || 0),
      0
    );

    return {
      totalTransactions: transactions.length,
      successful: successful.length,
      pending: pending.length,
      failed: failed.length,
      totalRevenue,
      pendingAmount,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.userId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "ALL" ||
        tx.status?.toUpperCase() === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, selectedStatus]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      description: "Successful payments",
      icon: CurrencyDollar,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Total Transactions",
      value: stats.totalTransactions.toLocaleString(),
      description: "All payment records",
      icon: Receipt,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Successful Payments",
      value: stats.successful.toLocaleString(),
      description: "Completed transactions",
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Pending Payments",
      value: formatCurrency(stats.pendingAmount),
      description: `${stats.pending} pending transactions`,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return "bg-emerald-50 text-emerald-700";
      case "FAILED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">

      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Sales & Revenue
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor payments, transactions and business revenue.
          </p>
        </div>

        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#25632D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1f5225] disabled:opacity-50"
        >
          <ArrowClockwise
            size={18}
            className={loading ? "animate-spin" : ""}
          />
          Refresh Data
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>
                  <h2 className="mt-3 text-xl font-black text-slate-900">
                    {loading ? "..." : card.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${card.color}`}>
                  <Icon size={25} weight="duotone" />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* PAYMENT PERFORMANCE */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Payment Performance
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Overview of transaction statuses
              </p>
            </div>

            <TrendUp size={24} className="text-emerald-600" />
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Loading payment statistics...
            </p>
          ) : (
            <div className="space-y-6">

              {[
                {
                  label: "Successful",
                  count: stats.successful,
                  color: "bg-emerald-500",
                },
                {
                  label: "Pending",
                  count: stats.pending,
                  color: "bg-amber-400",
                },
                {
                  label: "Failed",
                  count: stats.failed,
                  color: "bg-red-500",
                },
              ].map((item) => {
                const percentage =
                  stats.totalTransactions > 0
                    ? (item.count / stats.totalTransactions) * 100
                    : 0;

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-semibold text-slate-600">
                        {item.label}
                      </span>
                      <span className="font-bold text-slate-900">
                        {item.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-2">
            <Wallet size={23} className="text-emerald-600" />
            <h2 className="font-bold text-slate-900">
              Revenue Summary
            </h2>
          </div>

          <p className="text-xs text-slate-500">
            Confirmed revenue
          </p>

          <h2 className="mt-2 text-2xl font-black text-emerald-700">
            {loading ? "..." : formatCurrency(stats.totalRevenue)}
          </h2>

          <div className="my-5 border-t border-slate-100" />

          <div className="flex justify-between py-2 text-sm">
            <span className="text-slate-500">Successful</span>
            <span className="font-bold text-emerald-600">
              {stats.successful}
            </span>
          </div>

          <div className="flex justify-between py-2 text-sm">
            <span className="text-slate-500">Pending</span>
            <span className="font-bold text-amber-600">
              {stats.pending}
            </span>
          </div>

          <div className="flex justify-between py-2 text-sm">
            <span className="text-slate-500">Failed</span>
            <span className="font-bold text-red-600">
              {stats.failed}
            </span>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 p-5">
          <div className="mb-5">
            <h2 className="font-bold text-slate-900">
              Recent Transactions
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              View and track customer payment records.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search order, phone, reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Transactions</option>
              <option value="SUCCESS">Successful</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Loading transactions...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50">
                <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Order / Reference</th>
                  <th className="px-5 py-4">Customer Phone</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Provider</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-800">
                          {tx.orderId || "N/A"}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Ref: {tx.referenceNumber || "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {tx.phoneNumber || "N/A"}
                      </td>

                      <td className="px-5 py-4 text-sm font-bold text-slate-900">
                        {formatCurrency(tx.amount)}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {tx.provider || "N/A"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(tx.status)}`}
                        >
                          {tx.status || "PENDING"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500">
                        {tx.createdAt
                          ? new Date(tx.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-slate-400"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      </div>
    </div>
  );
}
