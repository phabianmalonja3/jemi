
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  CurrencyDollar,
  MagnifyingGlass,
  Funnel,
  Eye,
  ArrowUpRight,
  CalendarBlank,
  Camera,
  MapPin,
} from "@phosphor-icons/react";

import { CalendarClock } from "lucide-react";
import LoadingSpinner from "@/components/web/LoadingSpinner";

interface Booking {
  id: string;
  type: string;
  pickupTime: string;
  addressName: string;
  amountPaid: number;
  status: string;
  paymentStatus: string;
  photographer?: {
    id: string;
    name: string;
  };
  client?: {
    id: string;
    name: string;
  };
  pkg?: {
    id: string;
    name: string;
  };
}

const statusStyles: Record<string, string> = {
  ACCEPTED: "bg-blue-50 text-blue-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PENDING: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-rose-50 text-rose-700",
};

const colorStyles: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  rose: "bg-rose-50 text-rose-600",
  violet: "bg-violet-50 text-violet-600",
};

const formatCurrency = (amount: number) => {
  return `TZS ${Number(amount || 0).toLocaleString("en-TZ")}`;
};

const formatDate = (date: string) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleString("en-TZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeStatus = (status?: string) => {
  const value = status?.toUpperCase() || "PENDING";

  return value === "ACCEPTED" ? "CONFIRMED" : value;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // FETCH BOOKINGS
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/sales/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      const bookingData = Array.isArray(data)
        ? data
        : data?.content ??
          data?.data?.content ??
          data?.data ??
          [];

      setBookings(Array.isArray(bookingData) ? bookingData : []);

    } catch (error) {
      console.error("Booking fetch error:", error);
      toast.error("There was an error fetching bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // STATISTICS
  const stats = useMemo(() => {
    const total = bookings.length;

    const pending = bookings.filter(
      (b) => normalizeStatus(b.status) === "PENDING"
    ).length;

    const confirmed = bookings.filter(
      (b) => normalizeStatus(b.status) === "CONFIRMED"
    ).length;

    const completed = bookings.filter(
      (b) => normalizeStatus(b.status) === "COMPLETED"
    ).length;

    const cancelled = bookings.filter(
      (b) => normalizeStatus(b.status) === "CANCELLED"
    ).length;

    const revenue = bookings.reduce(
      (sum, booking) => sum + Number(booking.amountPaid || 0),
      0
    );

    const average = total > 0 ? revenue / total : 0;

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      revenue,
      average,
    };
  }, [bookings]);

  // STATUS DISTRIBUTION
  const statusOverview = useMemo(() => {
    const total = bookings.length || 1;

    return [
      {
        label: "Completed",
        value: stats.completed,
        percent: (stats.completed / total) * 100,
        color: "bg-emerald-500",
      },
      {
        label: "Confirmed",
        value: stats.confirmed,
        percent: (stats.confirmed / total) * 100,
        color: "bg-blue-500",
      },
      {
        label: "Pending",
        value: stats.pending,
        percent: (stats.pending / total) * 100,
        color: "bg-amber-400",
      },
      {
        label: "Cancelled",
        value: stats.cancelled,
        percent: (stats.cancelled / total) * 100,
        color: "bg-rose-500",
      },
    ];
  }, [bookings, stats]);

  // SEARCH AND FILTER
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        booking.id?.toLowerCase().includes(searchValue) ||
        booking.addressName?.toLowerCase().includes(searchValue) ||
        booking.client?.name?.toLowerCase().includes(searchValue) ||
        booking.photographer?.name?.toLowerCase().includes(searchValue) ||
        booking.pkg?.name?.toLowerCase().includes(searchValue) ||
        booking.type?.toLowerCase().includes(searchValue);

      const normalizedStatus = normalizeStatus(booking.status);

      const matchesStatus =
        statusFilter === "ALL" ||
        normalizedStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  // DASHBOARD CARDS
  const statCards = [
    {
      title: "Total Bookings",
      value: stats.total.toLocaleString(),
      description: "All platform bookings",
      icon: CalendarCheck,
      color: "emerald",
    },
    {
      title: "Pending Bookings",
      value: stats.pending.toLocaleString(),
      description: "Awaiting confirmation",
      icon: CalendarClock,
      color: "amber",
    },
    {
      title: "Confirmed Bookings",
      value: stats.confirmed.toLocaleString(),
      description: "Approved bookings",
      icon: CheckCircle,
      color: "blue",
    },
    {
      title: "Completed Bookings",
      value: stats.completed.toLocaleString(),
      description: "Successfully completed",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Cancelled Bookings",
      value: stats.cancelled.toLocaleString(),
      description: "Cancelled reservations",
      icon: XCircle,
      color: "rose",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.revenue),
      description: "Total amount paid",
      icon: CurrencyDollar,
      color: "violet",
    },
  ];

  return (
    <div className="space-y-7">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Bookings Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor customer reservations and photographer bookings across Jemigraph.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600">
          <CalendarBlank size={19} className="text-emerald-600" />
          Booking Overview
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorStyles[stat.color]}`}
                >
                  <Icon size={23} weight="duotone" />
                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-300"
                />
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900 break-words">
                  {stat.value}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOOKING SUMMARY */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* STATUS OVERVIEW */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <h2 className="font-bold text-slate-900">
            Booking Status Overview
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Distribution of all platform bookings
          </p>

          <div className="mt-7 space-y-5">
            {statusOverview.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-600">
                    {item.label}
                  </span>

                  <span className="font-bold text-slate-900">
                    {item.value} ({item.percent.toFixed(1)}%)
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REVENUE CARD */}
        <div className="rounded-xl bg-[#25632D] p-6 text-white">
          <div className="flex items-center justify-between">
            <CurrencyDollar size={28} weight="duotone" />
            <ArrowUpRight size={22} />
          </div>

          <p className="mt-6 text-sm text-emerald-100">
            Average Booking Value
          </p>

          <h2 className="mt-2 text-3xl font-black break-words">
            {formatCurrency(stats.average)}
          </h2>

          <p className="mt-3 text-xs leading-5 text-emerald-100">
            Average amount paid per booking across the platform.
          </p>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

        {/* TABLE HEADER */}
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="font-bold text-slate-900">
                All Bookings
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Track and monitor all customer reservations
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SEARCH */}
              <div className="relative">
                <MagnifyingGlass
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 sm:w-64"
                />
              </div>

              {/* STATUS FILTER */}
              <div className="relative">
                <Funnel
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-8 text-sm outline-none focus:border-emerald-500 sm:w-44"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* REFRESH */}
              <button
                onClick={fetchBookings}
                disabled={loading}
                className="h-10 rounded-lg bg-[#25632D] px-4 text-sm font-semibold text-white transition hover:bg-[#1d4f24] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* TABLE BODY */}
        <div className="overflow-x-auto">

          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner
                message="Loading Bookings..."
                size="md"
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm">

              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Booking</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Photographer</th>
                  <th className="px-5 py-4">Event / Address</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Payment</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const status = normalizeStatus(booking.status);

                    return (
                      <tr
                        key={booking.id}
                        className="transition hover:bg-slate-50"
                      >

                        {/* BOOKING ID */}
                        <td className="whitespace-nowrap px-5 py-4">
                          <p className="font-bold text-[#25632D]">
                            {booking.id}
                          </p>
                        </td>

                        {/* CUSTOMER */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                              <Camera size={17} />
                            </div>

                            <p className="font-bold text-slate-800">
                              {booking.client?.name || "Unknown Client"}
                            </p>
                          </div>
                        </td>

                        {/* PHOTOGRAPHER */}
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700">
                          {booking.photographer?.name || "Unassigned"}
                        </td>

                        {/* EVENT / ADDRESS */}
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-700">
                            {booking.pkg?.name || booking.type || "Standard"}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                            <MapPin size={13} />
                            {booking.addressName || "N/A"}
                          </p>
                        </td>

                        {/* DATE */}
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          <div className="flex items-center gap-2">
                            <CalendarBlank
                              size={16}
                              className="text-slate-400"
                            />
                            {formatDate(booking.pickupTime)}
                          </div>
                        </td>

                        {/* AMOUNT */}
                        <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-800">
                          {formatCurrency(booking.amountPaid)}
                        </td>

                        {/* BOOKING STATUS */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              statusStyles[status] ||
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        {/* PAYMENT STATUS */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              booking.paymentStatus?.toUpperCase() === "PAID"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {booking.paymentStatus || "UNKNOWN"}
                          </span>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <CalendarClock
                          size={36}
                          className="text-slate-300"
                        />

                        <p className="font-semibold text-slate-600">
                          No bookings found.
                        </p>

                        <p className="text-xs text-slate-400">
                          Try changing your search or status filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          )}
        </div>

        {/* TABLE FOOTER */}
        {!loading && (
          <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {filteredBookings.length} of {bookings.length} bookings
            </span>

            <span>
              Total Revenue:{" "}
              <strong className="text-slate-800">
                {formatCurrency(stats.revenue)}
              </strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
