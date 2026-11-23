
"use client";

import React from "react";
import {
  Camera,
  UsersThree,
  UserCheck,
  UserPlus,
  CalendarCheck,
  CurrencyDollar,
  TrendUp,
  ArrowUpRight,
  Star,
  MapPin,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import Link from "next/link";

const stats = [
  {
    title: "Total Photographers",
    value: "186",
    change: "+12.4%",
    description: "Registered photographers",
    icon: Camera,
    color: "emerald",
  },
  {
    title: "Active Photographers",
    value: "142",
    change: "+8.6%",
    description: "Currently active",
    icon: UserCheck,
    color: "blue",
  },
  {
    title: "New Photographers",
    value: "24",
    change: "+15.2%",
    description: "Joined this month",
    icon: UserPlus,
    color: "violet",
  },
  {
    title: "Photographers with Bookings",
    value: "118",
    change: "+9.5%",
    description: "Received bookings",
    icon: CalendarCheck,
    color: "amber",
  },
  {
    title: "Total Bookings",
    value: "864",
    change: "+11.8%",
    description: "Photographer bookings",
    icon: UsersThree,
    color: "pink",
  },
  {
    title: "Revenue Generated",
    value: "TZS 86.4M",
    change: "+18.3%",
    description: "Total booking revenue",
    icon: CurrencyDollar,
    color: "green",
  },
];

const photographers = [
  {
    name: "James Photography",
    email: "james@gmail.com",
    location: "Dar es Salaam",
    bookings: 48,
    revenue: "TZS 8,500,000",
    rating: 4.9,
    status: "Active",
  },
  {
    name: "Grace Studios",
    email: "grace@gmail.com",
    location: "Arusha",
    bookings: 36,
    revenue: "TZS 6,200,000",
    rating: 4.8,
    status: "Active",
  },
  {
    name: "Michael Lens",
    email: "michael@gmail.com",
    location: "Dodoma",
    bookings: 12,
    revenue: "TZS 1,800,000",
    rating: 4.5,
    status: "Inactive",
  },
  {
    name: "Elegant Moments",
    email: "elegant@gmail.com",
    location: "Mwanza",
    bookings: 29,
    revenue: "TZS 4,500,000",
    rating: 4.7,
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

export default function PhotographersPage() {
  return (
    <div className="space-y-7">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Photographers Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor photographer registrations, bookings and performance across Jemigraph.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-slate-600">
          <TrendUp size={19} className="text-emerald-600" />
          Performance Overview
        </div>
      </div>

      {/* STATS */}
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

      {/* PERFORMANCE SUMMARY */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <div>
            <h2 className="font-bold text-slate-900">
              Photographer Activity
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Current photographer engagement
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-500">
                Active Photographers
              </p>

              <h3 className="mt-2 text-2xl font-black text-slate-900">
                142
              </h3>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[76%] rounded-full bg-emerald-500" />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                76.3% of registered photographers
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                With Bookings
              </p>

              <h3 className="mt-2 text-2xl font-black text-slate-900">
                118
              </h3>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[63%] rounded-full bg-blue-500" />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                63.4% of registered photographers
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[#25632D] p-6 text-white">
          <div className="flex items-center justify-between">
            <Camera size={28} weight="duotone" />
            <TrendUp size={22} />
          </div>

          <p className="mt-6 text-sm text-emerald-100">
            Average Revenue per Photographer
          </p>

          <h2 className="mt-2 text-3xl font-black">
            TZS 464,516
          </h2>

          <p className="mt-3 text-xs leading-5 text-emerald-100">
            Average booking revenue generated per registered photographer.
          </p>
        </div>
      </div>

      {/* PHOTOGRAPHERS TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              Registered Photographers
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Photographer directory and performance
            </p>
          </div>

         <Link
  href="/sales/photographers/photographer-list"
  className="text-sm font-bold text-[#25632D] hover:underline"
>
  View All Photographers
</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Photographer</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Bookings</th>
                <th className="px-5 py-4">Revenue</th>
                <th className="px-5 py-4">Rating</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {photographers.map((photographer) => (
                <tr
                  key={photographer.email}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800">
                      {photographer.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {photographer.email}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} />
                      {photographer.location}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-700">
                    {photographer.bookings}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-800">
                    {photographer.revenue}
                  </td>

                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star size={16} weight="fill" />
                      {photographer.rating}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      photographer.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {photographer.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      aria-label={`More actions for ${photographer.name}`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                      <DotsThreeVertical size={20} />
                    </button>
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
