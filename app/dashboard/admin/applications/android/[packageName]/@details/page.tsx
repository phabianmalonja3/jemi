import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { ArrowLeft, ShieldCheck } from "lucide-react";

type PageProps = {
  params: Promise<{
    packageName: string;
  }>;
};

type TrackRelease = {
  status: string;
  versionCodes: number[];
  userFraction: number | null;
  releaseNotesCount: number;
};

type Track = {
  trackName: string;
  releases: TrackRelease[];
};

type AppDetailsResponse = {
  packageName: string;
  tracks: Track[];
  note?: string;
};

async function fetchAppDetails(packageName: string): Promise<AppDetailsResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://api.jemigraph.co.tz/api/v0.1";

  // Kusanya headers kutoka kwa ombi la sasa ili kufoward auth/cookies kwenye Spring Boot backend
  const requestHeaders = await headers();
  const cookieHeader = requestHeaders.get("cookie") || "";
  const authHeader = requestHeaders.get("authorization") || "";

  const res = await fetch(
    `${baseUrl}/google-play/app-details?packageName=${encodeURIComponent(packageName)}`,
    { 
      cache: "no-store",
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(authHeader ? { Authorization: authHeader } : {}),
        "Content-Type": "application/json",
      }
    }
  );

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? err.message ?? `HTTP ${res.status}`);
  }

  return res.json();
}

function PlayStoreIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.609 1.814L13.792 12 3.61 22.186c-.368.188-.79-.047-.79-.456V2.27c0-.41.422-.644.79-.456z" fill="#4285F4"/>
      <path d="M17.172 15.38l-3.38-3.38L3.609 22.186c.353.359.923.376 1.296.036l12.267-6.842z" fill="#EA4335"/>
      <path d="M17.172 8.62L4.905 1.778c-.373-.34-.943-.323-1.296.036L13.792 12l3.38-3.38z" fill="#FBBC05"/>
      <path d="M17.172 8.62l3.156 1.762c.706.395.706 1.401 0 1.796l-3.156 1.762-3.38-3.38 3.38-3.38z" fill="#34A853"/>
    </svg>
  );
}

export default async function AppDetailPage(props: PageProps) {
  const params = await props.params;
  const packageName = decodeURIComponent(params.packageName).trim();

  const data = await fetchAppDetails(packageName);

  const totalTracks = data.tracks?.length || 0;
  const totalReleases = data.tracks?.reduce((acc, track) => acc + (track.releases?.length || 0), 0) || 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link href="/admin/google-play" className="inline-flex items-center text-xs font-semibold text-gray-600 hover:text-emerald-600 transition">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Rudi kwenye Orodha
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-100 gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
              <PlayStoreIcon className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Google Play Console App
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{packageName}</h1>
              <p className="text-xs font-mono text-gray-500 mt-0.5">Package Track Sync</p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Live API Connected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Active Release Tracks</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{totalTracks}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Total Track Releases</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">{totalReleases}</p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-gray-900">Tracks Details</h3>
          {data.tracks.map((track) => (
            <div key={track.trackName} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm font-semibold text-emerald-700 uppercase">{track.trackName}</span>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                  {track.releases.length} Release(s)
                </span>
              </div>
              <div className="divide-y divide-gray-200/60">
                {track.releases.map((rel, idx) => (
                  <div key={idx} className="py-2 text-xs flex justify-between items-center">
                    <div>
                      <span className="text-gray-500">Status: </span>
                      <span className="font-medium text-gray-900">{rel.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Versions: </span>
                      <span className="font-mono text-gray-800">{rel.versionCodes.join(", ") || "—"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
          <h3 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">Status Report</h3>
          <p className="text-sm text-gray-700 font-mono">
            Data fetched successfully from Spring Boot backend endpoint for package <span className="font-bold">{packageName}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}