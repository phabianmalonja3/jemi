"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  UserGroupIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/web/LoadingSpinner";

interface OnlinePhotographer {
  id: string;
  name: string;
  email: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export default function AdminOnlinePhotographersPage() {
  const [photographers, setPhotographers] = useState<
    OnlinePhotographer[]
  >([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOnlinePhotographers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/photographers/online`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setPhotographers(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error(error);
      toast.error("There was an error fetching online photographers.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOnlinePhotographers();
  }, []);

  const filteredPhotographers = photographers.filter((photographer) => {
    const search = searchTerm.toLowerCase();

    return (
      photographer.name?.toLowerCase().includes(search) ||
      photographer.email?.toLowerCase().includes(search) ||
      photographer.phone?.toLowerCase().includes(search) ||
      photographer.id?.toLowerCase().includes(search)
    );
  });

  const stats = {
    total: photographers.length,
  };

  const formatCoordinate = (value: number) => {
    return Number(value).toFixed(6);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserGroupIcon className="w-7 h-7 text-emerald-600" />
          Online Photographers
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500">
            Total Online
          </div>

          <div className="text-2xl font-bold text-green-600">
            {stats.total}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-emerald-500">
          <div className="text-sm text-gray-500">
            Live Status
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />

            <span className="text-lg font-semibold text-green-600">
              Active
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">
            Showing
          </div>

          <div className="text-2xl font-bold text-blue-600">
            {filteredPhotographers.length}
          </div>
        </div>

      </div>

      {/* Search + Refresh */}
      <div className="flex flex-wrap gap-4 mb-6">

        <div className="relative flex-1 min-w-[250px]">

          <input
            type="text"
            placeholder="Search by name, email, phone or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full
              border
              px-3
              py-2
              pl-10
              rounded-md
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500
            "
          />

          <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />

        </div>

        <button
          onClick={() => fetchOnlinePhotographers(true)}
          disabled={refreshing}
          className="
            bg-emerald-600
            text-white
            px-4
            py-2
            rounded-md
            hover:bg-emerald-700
            text-sm
            font-medium
            transition
            flex
            items-center
            gap-2
            disabled:opacity-50
          "
        >

          <ArrowPathIcon
            className={`w-4 h-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />

          Refresh

        </button>

        <div className="ml-auto flex items-center text-sm text-gray-600">
          Showing{" "}
          <strong className="mx-1">
            {filteredPhotographers.length}
          </strong>{" "}
          of{" "}
          <strong className="mx-1">
            {photographers.length}
          </strong>{" "}
          online
        </div>

      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner
          message="Loading online photographers..."
          size="md"
        />
      ) : (
        <div
          className="w-full border rounded-lg shadow-sm"
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >

          <table
            className="w-full divide-y divide-gray-200"
            style={{ minWidth: "1100px" }}
          >

            <thead className="bg-gray-50">

              <tr>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photographer
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coordinates
                </th>

              </tr>

            </thead>

            <tbody className="bg-white divide-y divide-gray-200">

              {filteredPhotographers.length > 0 ? (

                filteredPhotographers.map((photographer) => (

                  <tr
                    key={photographer.id}
                    className="hover:bg-gray-50 transition"
                  >

                    {/* Photographer */}
                    <td className="px-6 py-4 whitespace-nowrap">

                      <div className="flex items-center gap-3">

                        <div className="
                          w-9
                          h-9
                          rounded-full
                          bg-emerald-100
                          flex
                          items-center
                          justify-center
                        ">
                          <UserIcon className="w-5 h-5 text-emerald-600" />
                        </div>

                        <div>

                          <div className="text-sm font-medium text-gray-900">
                            {photographer.name}
                          </div>

                          <div className="text-xs font-mono text-gray-400">
                            {photographer.id.slice(0, 8)}...
                          </div>

                        </div>

                      </div>

                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 whitespace-nowrap">

                      <div className="flex items-center gap-2 text-sm text-gray-700">

                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />

                        {photographer.email}

                      </div>

                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 whitespace-nowrap">

                      <div className="flex items-center gap-2 text-sm text-gray-700">

                        <PhoneIcon className="w-4 h-4 text-gray-400" />

                        {photographer.phone || "N/A"}

                      </div>

                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">

                      <span className="
                        px-3
                        py-1
                        inline-flex
                        items-center
                        gap-2
                        text-xs
                        leading-5
                        font-semibold
                        rounded-full
                        border
                        bg-green-100
                        text-green-800
                        border-green-200
                      ">

                        <span className="
                          w-2
                          h-2
                          rounded-full
                          bg-green-500
                          animate-pulse"
                        />

                        Online

                      </span>

                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 whitespace-nowrap">

                      <div className="flex items-center gap-2">

                        <MapPinIcon className="w-5 h-5 text-red-500" />

                        <span className="text-sm text-gray-700">
                          Live Location
                        </span>

                      </div>

                    </td>

                    {/* Coordinates */}
                    <td className="px-6 py-4 whitespace-nowrap">

                      <div className="text-sm">

                        <div className="text-gray-700">
                          Lat:{" "}
                          <span className="font-mono">
                            {formatCoordinate(
                              photographer.latitude
                            )}
                          </span>
                        </div>

                        <div className="text-gray-700">
                          Lng:{" "}
                          <span className="font-mono">
                            {formatCoordinate(
                              photographer.longitude
                            )}
                          </span>
                        </div>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >

                    <div className="flex flex-col items-center gap-2">

                      <UserGroupIcon className="w-12 h-12 text-gray-300" />

                      <p>
                        No photographers are currently online.
                      </p>

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