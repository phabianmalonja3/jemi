
"use client";

import React from "react";
import {
  UsersThree,
  UserPlus,
  UserCheck,
  CalendarCheck,
  CurrencyDollar,
  Camera,
  TrendUp,
  ArrowUpRight,
  ArrowDownRight,
} from "@phosphor-icons/react";

const stats = [
  {
    title: "Total Customers",
    value: "1,248",
    change: "+12.5%",
    positive: true,
    description: "All registered customers",
    icon: UsersThree,
    color: "emerald",
  },
  {
    title: "Active Customers",
    value: "986",
    change: "+8.2%",
    positive: true,
    description: "Currently active customers",
    icon: UserCheck,
    color: "blue",
  },
  {
    title: "New Customers",
    value: "86",
    change: "+15.3%",
    positive: true,
    description: "Registered this month",
    icon: UserPlus,
    color: "violet",
  },
  {
    title: "Customers with Bookings",
    value: "742",
    change: "+6.8%",
    positive: true,
    description: "Customers who booked",
    icon: CalendarCheck,
    color: "amber",
  },
  {
    title: "Total Bookings",
    value: "1,586",
    change: "+10.4%",
    positive: true,
    description: "All customer bookings",
    icon: Camera,
    color: "pink",
  },
  {
    title: "Total Revenue",
    value: "TZS 48.5M",
    change: "+18.6%",
    positive: true,
    description: "Revenue from customers",
    icon: CurrencyDollar,
    color: "green",
  },
];

const customers = [
  {
    name: "John Michael",
    email: "john@gmail.com",
    phone: "+255 712 345 678",
    bookings: 12,
    spent: "TZS 2,450,000",
    status: "Active",
  },
  {
    name: "Sarah Joseph",
    email: "sarah@gmail.com",
    phone: "+255 754 123 456",
    bookings: 8,
    spent: "TZS 1,800,000",
    status: "Active",
  },
  {
    name: "David Emmanuel",
    email: "david@gmail.com",
    phone: "+255 689 234 567",
    bookings: 3,
    spent: "TZS 650,000",
    status: "Inactive",
  },
  {
    name: "Grace Peter",
    email: "grace@gmail.com",
    phone: "+255 713 456 789",
    bookings: 15,
    spent: "TZS 3,200,000",
    status: "Active",
  },
];

const colorStyles: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
  pink: "bg-pink-50 text-pink-600",
  green: "bg-green-50 text-green-600",
};

export default function CustomersPage() {
  return (
    <div className="space-y-7">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Customers Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor Jemigraph customers, bookings and customer revenue.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-600">
          <TrendUp size={18} className="text-emerald-600" />
          Customer Insights
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorStyles[stat.color]}`}>
                  <Icon size={23} weight="duotone" />
                </div>

                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <ArrowUpRight size={15} />
                  {stat.change}
                </span>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
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

      {/* CUSTOMER SUMMARY */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Customer Activity
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Overview of customer engagement
              </p>
            </div>

            <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              This Month
            </span>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-500">
                Customers with bookings
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">
                742
              </h3>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[75%] rounded-full bg-emerald-500" />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                59.4% of total customers
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Customers without bookings
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-900">
                506
              </h3>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[41%] rounded-full bg-amber-400" />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                40.6% of total customers
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[#25632D] p-6 text-white">
          <div className="flex items-center justify-between">
            <Camera size={27} weight="duotone" />
            <TrendUp size={22} />
          </div>

          <p className="mt-6 text-sm text-emerald-100">
            Average Customer Value
          </p>

          <h2 className="mt-2 text-3xl font-black">
            TZS 65,000
          </h2>

          <p className="mt-3 text-xs leading-5 text-emerald-100">
            Average revenue generated per customer across the Jemigraph platform.
          </p>
        </div>
      </div>

      {/* RECENT CUSTOMERS */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              Recent Customers
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Recently registered customers on Jemigraph
            </p>
          </div>

          <button className="text-sm font-bold text-[#25632D] hover:underline">
            View All Customers
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Bookings</th>
                <th className="px-5 py-4">Total Spent</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr key={customer.email} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800">
                      {customer.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {customer.email}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    {customer.phone}
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-700">
                    {customer.bookings}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-800">
                    {customer.spent}
                  </td>

                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      customer.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {customer.status}
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
