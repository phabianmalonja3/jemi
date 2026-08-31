"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

interface Subscriber {
  userId: string;
  email: string;
  subscriptionStatus: "ACTIVE" | "INACTIVE" | "TRIAL" | "EXPIRED" | "CANCELLED";
  expiresAt: string | null;
  planName: string;
  planAmount: number | null;
  durationInDays: number;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [planFilter, setPlanFilter] = useState<string>("ALL");

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/subscribers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      console.log("Fetched subscribers:", data);

      // Handle both array and paginated response
      setSubscribers(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error(error);
      toast.error("There was an error fetching subscribers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Get unique plan names for filter
  const uniquePlans = Array.from(
    new Set(subscribers.map((s) => s.planName).filter((plan) => plan !== "N/A"))
  );

  // Filter subscribers
  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch =
      sub.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.userId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || sub.subscriptionStatus === statusFilter;

    const matchesPlan =
      planFilter === "ALL" || sub.planName === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Get status badge color and icon
  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircleIcon className="w-4 h-4 mr-1" />,
          label: "Active",
        };
      case "TRIAL":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <ClockIcon className="w-4 h-4 mr-1" />,
          label: "Trial",
        };
      case "INACTIVE":
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <XCircleIcon className="w-4 h-4 mr-1" />,
          label: "Inactive",
        };
      case "EXPIRED":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircleIcon className="w-4 h-4 mr-1" />,
          label: "Expired",
        };
      case "CANCELLED":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <XCircleIcon className="w-4 h-4 mr-1" />,
          label: "Cancelled",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: null,
          label: status || "Unknown",
        };
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get days remaining
  const getDaysRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Statistics
  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.subscriptionStatus === "ACTIVE").length,
    trial: subscribers.filter((s) => s.subscriptionStatus === "TRIAL").length,
    inactive: subscribers.filter((s) => s.subscriptionStatus === "INACTIVE").length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <UserIcon className="w-7 h-7 text-blue-600" />
        Subscribers Management
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Total Subscribers</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-400">
          <div className="text-sm text-gray-500">Trial</div>
          <div className="text-2xl font-bold text-blue-600">{stats.trial}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-400">
          <div className="text-sm text-gray-500">Inactive</div>
          <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by email or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border px-3 py-2 pl-10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <EnvelopeIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="TRIAL">Trial</option>
          <option value="INACTIVE">Inactive</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {/* Plan Filter */}
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[130px]"
        >
          <option value="ALL">All Plans</option>
          {uniquePlans.map((plan) => (
            <option key={plan} value={plan}>
              {plan}
            </option>
          ))}
          <option value="N/A">No Plan</option>
        </select>

        {/* Refresh Button */}
        <button
          onClick={fetchSubscribers}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 text-sm font-medium transition flex items-center gap-2"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>

        {/* Results count */}
        <div className="ml-auto flex items-center text-sm text-gray-600">
          Showing <strong className="mx-1">{filteredSubscribers.length}</strong> of{" "}
          <strong className="mx-1">{subscribers.length}</strong> subscribers
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading subscribers...</span>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Left
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((subscriber) => {
                  const statusBadge = getStatusBadge(subscriber.subscriptionStatus);
                  const daysRemaining = getDaysRemaining(subscriber.expiresAt);
                  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0;

                  return (
                    <tr key={subscriber.userId} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-600">
                          {subscriber.userId.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                          {subscriber.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${statusBadge.color}`}
                        >
                          {statusBadge.icon}
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {subscriber.planName !== "N/A" ? (
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                              {subscriber.planName}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">No Plan</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subscriber.planAmount ? (
                            <span className="font-semibold text-emerald-600">
                              {formatCurrency(subscriber.planAmount)}
                            </span>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {subscriber.durationInDays > 0 ? (
                            `${subscriber.durationInDays} days`
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          {formatDate(subscriber.expiresAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {daysRemaining !== null ? (
                          <span
                            className={`text-sm font-semibold ${
                              daysRemaining <= 0
                                ? "text-red-600"
                                : isExpiringSoon
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {daysRemaining <= 0 ? "Expired" : `${daysRemaining} days`}
                            {isExpiringSoon && " ⚠️"}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-6 text-center text-sm text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <UserIcon className="w-12 h-12 text-gray-300" />
                      <p>No subscribers found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Export Button */}
      {!loading && filteredSubscribers.length > 0 && (
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => {
              // Copy to clipboard
              const emails = filteredSubscribers.map((s) => s.email).join(", ");
              navigator.clipboard.writeText(emails);
              toast.success("Emails copied to clipboard!");
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm font-medium transition flex items-center gap-2"
          >
            <EnvelopeIcon className="w-4 h-4" />
            Copy Emails
          </button>
          <button
            onClick={() => {
              // Export to CSV
              const headers = [
                "User ID",
                "Email",
                "Status",
                "Plan",
                "Amount (TZS)",
                "Duration (Days)",
                "Expires At",
              ];
              const csvData = filteredSubscribers.map((s) => [
                s.userId,
                s.email,
                s.subscriptionStatus,
                s.planName,
                s.planAmount || "",
                s.durationInDays,
                s.expiresAt || "",
              ]);
              const csvContent =
                "data:text/csv;charset=utf-8," +
                [headers.join(","), ...csvData.map((row) => row.join(","))].join(
                  "\n"
                );
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success("CSV exported successfully!");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      )}
    </div>
  );
}