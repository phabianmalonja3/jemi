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
  CalendarIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/web/LoadingSpinner";

interface Subscriber {
  userId: string;
  email: string;
  subscriptionStatus: "ACTIVE" | "INACTIVE" | "TRIAL" | "EXPIRED" | "CANCELLED";
  expiresAt: string | null;
  planName: string;
  planAmount: number | null;
  durationInDays: number;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationInDays: number;
  description: string;
  active: boolean;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [planFilter, setPlanFilter] = useState<string>("ALL");

  // Modal States for Change Subscription
  const [selectedUser, setSelectedUser] = useState<Subscriber | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      setSubscribers(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error(error);
      toast.error("There was an error fetching subscribers.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription-plans`,
       
      );
      const activePlans = (response.data || []).filter((p: SubscriptionPlan) => p.active);
      setPlans(activePlans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to fetch subscription plans.");
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchPlans();
  }, []);

  // Handle Subscription Change Request Submission (Optimized Payload: userId & subscriptionPlanId)
  const handleRequestSubscriptionChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedPlanId) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/subscription-plans/request-change`,
        {
          userId: selectedUser.userId,
          subscriptionPlanId: selectedPlanId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Request sent! The Super Admin has been notified via email for approval.");
      setIsModalOpen(false);
      setSelectedUser(null);
      setSelectedPlanId("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit the modification request.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

        <button
          onClick={() => {
            fetchSubscribers();
            fetchPlans();
          }}
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

        <div className="ml-auto flex items-center text-sm text-gray-600">
          Showing <strong className="mx-1">{filteredSubscribers.length}</strong> of{" "}
          <strong className="mx-1">{subscribers.length}</strong> subscribers
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <LoadingSpinner message="Loading subscribers..." size="md" />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedUser(subscriber);
                            // Pre-select plan ID if it matches an existing plan
                            const matchedPlan = plans.find((p) => p.name === subscriber.planName);
                            setSelectedPlanId(matchedPlan ? matchedPlan.id : "");
                            setIsModalOpen(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition"
                        >
                          Change Sub
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={9}
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

      {/* SUBSCRIPTION CHANGE MODAL */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Change Subscription
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              User: <span className="font-semibold text-gray-700">{selectedUser.email}</span>
            </p>
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded mb-4">
              ⚠️ This action will send an approval email to the Super Admin before these changes are officially saved.
            </p>

            <form onSubmit={handleRequestSubscriptionChange} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Select Plan</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Select Plan --</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} ({plan.durationInDays} Days - TZS {plan.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-600 disabled:opacity-50"
                >
                  {submitting ? "Sending Request..." : "Send Approval Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}