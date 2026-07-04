"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { UserCheck, Eye, ChevronRight, Loader2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function PendingApprovalsTable() {
  const [approvals, setApprovals] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/pending-verification`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApprovals(response.data);
    } catch (error) {
      console.error("Failed to fetch pending users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/verify-photographer/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh list after successful verification
      setApprovals(approvals.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-10 rounded-2xl text-center border border-slate-200">
        <Loader2 className="animate-spin mx-auto text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Pending Approvals</h2>
          <p className="text-xs text-slate-400 mt-1">Awaiting verification</p>
        </div>
        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
          {approvals.length} New
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {approvals.length === 0 ? (
          <p className="p-6 text-sm text-slate-400 text-center">No pending approvals.</p>
        ) : (
          approvals.map((user) => (
            <div key={user.id} className="p-5 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <UserCheck size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-base text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Eye size={16} className="text-slate-400" />
                  </button>
                  <button 
                    onClick={() => handleVerify(user.id)}
                    className="px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}