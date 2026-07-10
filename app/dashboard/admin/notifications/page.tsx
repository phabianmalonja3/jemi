"use client";

import { useState } from "react";
import { Bell, CheckCircle, Info, AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data (Hii baadaye itatoka kwenye API yako ya Spring Boot)
const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "New Booking", message: "You have a new photo session booking from John.", type: "success", time: "5m ago" },
  { id: 2, title: "System Update", message: "Jemigraph will be under maintenance at 12:00 AM.", type: "info", time: "2h ago" },
  { id: 3, title: "Wallet Alert", message: "Your wallet balance is getting low.", type: "warning", time: "1d ago" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="text-emerald-500" />;
      case "warning": return <AlertTriangle className="text-amber-500" />;
      default: return <Info className="text-blue-500" />;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 text-sm">Manage and view your system updates.</p>
        </div>
        <button 
          onClick={() => setNotifications([])}
          className="text-rose-500 text-sm flex items-center gap-2 hover:bg-rose-50 px-3 py-2 rounded-lg transition"
        >
          <Trash2 size={16} /> Clear All
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition"
            >
              <div className="mt-1">{getIcon(n.type)}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{n.title}</h3>
                <p className="text-slate-600 text-sm">{n.message}</p>
                <span className="text-xs text-slate-400 mt-2 block">{n.time}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-400">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p>No new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}