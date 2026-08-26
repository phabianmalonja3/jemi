"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Booking {
  id: string;
  type: string;
  pickupTime: string;
  addressName: string;
  amountPaid: number;
  status: string;
  paymentStatus: string;
  photographer?: { id: string; name: string };
  client?: { id: string; name: string };
  pkg?: { id: string; name: string };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/bookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      console.log("Fetched bookings:", data);

      // Inashughulikia Page response ya Spring Boot (data.content) au Array ya kawaida
      setBookings(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error(error);
      toast.error("There was an error fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Kuchuja bookings kulingana na Client Name, Photographer Name, au Address
  const filteredBookings = bookings.filter(
    (b) =>
      b.addressName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.photographer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Booking Management </h1>

      {/* Search and Refresh Section */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Address, Client, or Photographer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md w-96 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchBookings}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition"
        >
          Refresh
        </button>
      </div>

      {/* Data Table */}
      {loading ? (
        <p className="text-gray-500">Loading bookings...</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type / Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photographer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.addressName || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 font-mono uppercase">
                        {booking.type || "STANDARD"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.client?.name || "Unknown Client"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.photographer?.name || "Unassigned"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {booking.amountPaid ? `${Number(booking.amountPaid).toLocaleString()} TZS` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status?.toUpperCase() === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : booking.status?.toUpperCase() === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : booking.status?.toUpperCase() === "ACCEPTED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status || "PENDING"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {booking.pickupTime
                        ? new Date(booking.pickupTime).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-6 text-center text-sm text-gray-500"
                  >
                    No bookings found.
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