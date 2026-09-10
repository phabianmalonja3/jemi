"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  ComputerDesktopIcon,
  UserIcon,
  EnvelopeIcon,
  ClockIcon,
  TrashIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { ComputerDesktopIcon as ComputerDesktopSolidIcon } from "@heroicons/react/24/solid";

interface SessionInfo {
  userId?: string;
  email?: string;
  deviceName?: string;
  createdAt?: string;
  lastActiveAt?: string;
  [key: string]: any;
}

export default function AdminSessionsPage() {
  const [sessionsMap, setSessionsMap] = useState<Record<string, SessionInfo>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/sessions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      console.log("Fetched active sessions:", data);
      setSessionsMap(data || {});
    } catch (error) {
      console.error(error);
      toast.error("There was an error fetching active sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Convert sessionsMap object entries to an array for easy mapping/filtering
  const sessionsList = Object.entries(sessionsMap).map(([userId, details]) => ({
    userId,
    ...details,
  }));

  // Apply search filter (by email, device name, or userId)
  const filteredSessions = sessionsList.filter((session) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      session.email?.toLowerCase().includes(term) ||
      session.deviceName?.toLowerCase().includes(term) ||
      session.userId?.toLowerCase().includes(term)
    );
  });

  // Format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Clear session by userId
  const handleClearSession = async (userId: string, identifier?: string) => {
    try {
      setActionLoading(userId);
      const token = localStorage.getItem("token");

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/sessions/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`Session cleared successfully for ${identifier || userId}`);
      fetchSessions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear session.");
    } finally {
      setActionLoading(null);
    }
  };

  // Statistics
  const stats = {
    totalActive: sessionsList.length,
    uniqueUsers: new Set(sessionsList.map((s) => s.userId)).size,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ComputerDesktopIcon className="w-7 h-7 text-blue-600" />
        Session Management
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Active Sessions</div>
          <div className="text-2xl font-bold">{stats.totalActive}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-500">Active Users Online</div>
          <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[250px]">
          <input
            type="text"
            placeholder="Search by email, device name, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border px-3 py-2 pl-10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <EnvelopeIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchSessions}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 text-sm font-medium transition flex items-center gap-2"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>

        {/* Results count */}
        <div className="ml-auto flex items-center text-sm text-gray-600">
          Showing <strong className="mx-1">{filteredSessions.length}</strong> of{" "}
          <strong className="mx-1">{sessionsList.length}</strong> active sessions
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading sessions...</span>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User / Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <tr key={session.userId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                          {session.email?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {session.email || "Unknown Email"}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {session.userId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ComputerDesktopSolidIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {session.deviceName || "Unknown Device"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(session.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(session.lastActiveAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleClearSession(session.userId, session.email)}
                        disabled={actionLoading === session.userId}
                        className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ml-auto disabled:opacity-50"
                      >
                        <TrashIcon className={`w-3.5 h-3.5 ${actionLoading === session.userId ? "animate-spin" : ""}`} />
                        {actionLoading === session.userId ? "Clearing..." : "Clear Session"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <ComputerDesktopIcon className="w-12 h-12 text-gray-300" />
                      <p>No active sessions found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}