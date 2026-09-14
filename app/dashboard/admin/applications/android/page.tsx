"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const APPS_DATA = {
  "com.jemigraph.app": {
    packageName: "com.jemigraph.app",
    appName: "Jemigraph (Client App)",
    appType: "Customer Booking & Portfolio",
  },
  "com.jemi.app": {
    packageName: "com.jemi.app",
    appName: "Jemigrapher (Partner App)",
    appType: "Photographer Portal & Wallet",
  },
};

function PlayStoreIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.609 1.814L13.792 12 3.61 22.186c-.368.188-.79-.047-.79-.456V2.27c0-.41.422-.644.79-.456z" fill="#4285F4"/>
      <path d="M17.172 15.38l-3.38-3.38L3.609 22.186c.353.359.923.376 1.296.036l12.267-6.842z" fill="#EA4335"/>
      <path d="M17.172 8.62L4.905 1.778c-.373-.34-.943-.323-1.296.036L13.792 12l3.38-3.38z" fill="#FBBC05"/>
      <path d="M17.172 8.62l3.156 1.762c.706.395.706 1.401 0 1.796l-3.156 1.762-3.38-3.38 3.38-3.38z" fill="#34A853"/>
    </svg>
  );
}

export default function AdminGooglePlayStaticPage() {
  const [selectedPkg, setSelectedPkg] = useState<string>("com.jemigraph.app");
  const router = useRouter();

  const handleSelectApp = (pkg: string, name: string) => {
    setSelectedPkg(pkg);
    toast.success(`Switched to ${name}`);
    router.push(`/dashboard/admin/applications/android/${pkg}`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 text-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Select Google Play App</h1>
        <p className="text-sm text-gray-500 mt-1">Bofya ikoni ya Play Store hapa chini kuchagua application husika.</p>
      </div>

      <div className="flex justify-center items-center gap-8 py-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
        {Object.entries(APPS_DATA).map(([pkg, app]) => {
          const isSelected = selectedPkg === pkg;
          return (
            <div key={pkg} className="flex flex-col items-center space-y-3">
              <div
                onClick={() => handleSelectApp(pkg, app.appName)}
                title={app.appName}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md bg-gray-50 border-2 ${
                  isSelected ? "border-emerald-600 bg-emerald-50/50 ring-4 ring-emerald-100" : "border-gray-200 hover:border-emerald-400"
                }`}
              >
                <PlayStoreIcon className="w-14 h-14" />
              </div>
              <span className={`text-xs font-semibold ${isSelected ? "text-emerald-600" : "text-gray-600"}`}>
                {app.appName.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}