"use client";

import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-sm w-full">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={40} />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          You do not have the required permissions to view this page. Please contact your administrator if you believe this is an error.
        </p>

        <button 
          onClick={() => router.back()}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    </div>
  );
}