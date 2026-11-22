
"use client";

import React from "react";
import {
  CurrencyDollar,
  CalendarCheck,
  UsersThree,
  Wallet,
  TrendUp,
  TrendDown,
  ArrowUpRight,
  ArrowRight,
  ChartLineUp,
  Clock,
  CheckCircle,
  Hourglass,
} from "@phosphor-icons/react";

const stats = [
  {
    title: "Total Sales",
    value: "TZS 0",
    change: "+0%",
    description: "Compared to last month",
    icon: CurrencyDollar,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Total Bookings",
    value: "0",
    change: "+0%",
    description: "Compared to last month",
    icon: CalendarCheck,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Total Customers",
    value: "0",
    change: "+0%",
    description: "Compared to last month",
    icon: UsersThree,
    color: "bg-purple-50 text-purple-700",
  },
  {
    title: "Total Commission",
    value: "TZS 0",
    change: "+0%",
    description: "Compared to last month",
    icon: Wallet,
    color: "bg-orange-50 text-orange-700",
  },
];

const bookings = [
  {
    name: "No bookings yet",
    service: "New bookings will appear here",
    date: "--",
    amount: "TZS 0",
    status: "Pending",
  },
];

const transactions = [
  {
    reference: "No transactions",
    customer: "Awaiting transactions",
    date: "--",
    amount: "TZS 0",
    status: "Pending",
  },
];

export default function SalesDashboardPage() {
  return (
    <div className="space-y-7">

      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#25632D]">
            Sales Management
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
            Sales Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor your sales, bookings and performance.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm">
          <CalendarCheck size={18} />
          <span>{new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}</span>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon size={25} weight="duotone" />
                </div>

                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <TrendUp size={15} />
                  {stat.change}
                </span>
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                {stat.title}
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900">
                {stat.value}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}

      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* REVENUE CHART */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Revenue Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your monthly sales performance
              </p>
            </div>

            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#25632D]">
              <option>This Year</option>
              <option>This Month</option>
              <option>This Week</option>
            </select>
          </div>

          <div className="mt-8 flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
            <div className="text-center">
              <ChartLineUp size={45} className="mx-auto text-[#25632D]" weight="duotone" />
              <p className="mt-3 font-semibold text-slate-600">
                Revenue chart
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Chart data will appear when connected to API
              </p>
            </div>
          </div>
        </div>

        {/* PERFORMANCE */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Booking Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overview of booking statuses
          </p>

          <div className="mt-8 flex justify-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-full border-[14px] border-slate-100">
              <div className="text-center">
                <p className="text-3xl font-black text-slate-900">0</p>
                <p className="text-xs text-slate-400">Bookings</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle size={17} className="text-emerald-600" />
                Completed
              </span>
              <span className="text-sm font-bold">0</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <Hourglass size={17} className="text-orange-500" />
                Pending
              </span>
              <span className="text-sm font-bold">0</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <Clock size={17} className="text-blue-600" />
                In Progress
              </span>
              <span className="text-sm font-bold">0</span>
            </div>

          </div>
        </div>

      </div>

      {/* RECENT BOOKINGS */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-bold text-slate-900">
              Recent Bookings
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Latest customer bookings
            </p>
          </div>

          <button className="flex items-center gap-2 text-sm font-semibold text-[#25632D] hover:underline">
            View All <ArrowRight size={17} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.name} className="border-t border-slate-100">
                  <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                    {booking.name}
                  </td>
                  <td className="px-5 py-5 text-sm text-slate-500">
                    {booking.service}
                  </td>
                  <td className="px-5 py-5 text-sm text-slate-500">
                    {booking.date}
                  </td>
                  <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                    {booking.amount}
                  </td>
                  <td className="px-5 py-5">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-bold text-slate-900">
              Recent Transactions
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Latest payment activities
            </p>
          </div>

          <button className="flex items-center gap-2 text-sm font-semibold text-[#25632D] hover:underline">
            View All <ArrowRight size={17} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Reference</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.reference} className="border-t border-slate-100">
                  <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                    {transaction.reference}
                  </td>
                  <td className="px-5 py-5 text-sm text-slate-500">
                    {transaction.customer}
                  </td>
                  <td className="px-5 py-5 text-sm text-slate-500">
                    {transaction.date}
                  </td>
                  <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                    {transaction.amount}
                  </td>
                  <td className="px-5 py-5">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
