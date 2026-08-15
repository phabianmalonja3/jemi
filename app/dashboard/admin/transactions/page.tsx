"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      console.log("Fetched transactions:", data);

      setTransactions(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error(error);
      toast.error("There was an error fetching transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter transactions locally based on Order ID, Phone Number, or Reference Number
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Transaction Management (Admin)</h1>

      {/* Search and Refresh Section */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Order ID, Phone, or Reference..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md w-96 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchTransactions}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-600 text-sm font-medium transition"
        >
          Refresh
        </button>
      </div>

      {/* Data Table */}
      {loading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order / Ref
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {tx.orderId}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        Ref: {tx.referenceNumber || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {tx.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono truncate max-w-[120px]">
                      {tx.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {tx.amount?.toLocaleString()} TZS
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.status?.toUpperCase() === "SUCCESS"
                            ? "bg-green-100 text-green-800"
                            : tx.status?.toUpperCase() === "FAILED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {tx.status || "PENDING"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-6 text-center text-sm text-gray-500"
                  >
                    No transactions found.
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