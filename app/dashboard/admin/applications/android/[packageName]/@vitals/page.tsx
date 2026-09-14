import { Suspense } from "react"
import VitalsLoading from "./loading"

type ErrorReport = {
  name?: string
  type?: string
  issue?: string
  deviceModel?: string
  osVersion?: string
  versionCode?: number
  createTime?: string
}

type VitalsResponse = {
  packageName: string
  success: boolean
  errorReports?: ErrorReport[]
  totalReports?: number
  message?: string
  note?: string
}

async function fetchVitals(packageName: string): Promise<VitalsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v0.1"
  const res = await fetch(
    `${baseUrl}/google-play/vitals?packageName=${encodeURIComponent(packageName)}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? "Failed to fetch vitals")
  }

  return res.json()
}

function formatDate(iso?: string) {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

async function VitalsContent({ packageName }: { packageName: string }) {
  const data = await fetchVitals(packageName)

  if (!data.success) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800 space-y-2">
        <h2 className="font-semibold">Failed to fetch vitals</h2>
        <p className="text-sm">{data.message ?? "Unknown error"}</p>
        {data.note && <p className="text-xs text-red-700">{data.note}</p>}
      </div>
    )
  }

  const reports = data.errorReports ?? []

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Vitals & Error Reports</h1>
          <p className="text-sm text-gray-500 font-mono">{data.packageName}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{data.totalReports ?? 0}</div>
          <div className="text-xs uppercase tracking-wide text-gray-500">Reports</div>
        </div>
      </header>

      {reports.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-6 text-gray-500">
          No error reports found for this app. 🎉
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Issue</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Device</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">OS</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Version</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Reported</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {reports.map((r, i) => (
                <tr key={r.name ?? i} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium">
                      {r.type ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">{r.issue ?? "—"}</td>
                  <td className="px-4 py-2">{r.deviceModel ?? "—"}</td>
                  <td className="px-4 py-2">{r.osVersion ?? "—"}</td>
                  <td className="px-4 py-2 font-mono">{r.versionCode ?? "—"}</td>
                  <td className="px-4 py-2 text-gray-500">{formatDate(r.createTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.note && (
        <p className="text-xs text-gray-500 border-t pt-3">{data.note}</p>
      )}
    </div>
  )
}

export default async function VitalsPage({
  searchParams,
}: {
  searchParams: { packageName?: string }
}) {
  const packageName = searchParams.packageName?.trim()

  if (!packageName) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        Missing <span className="font-mono">packageName</span> query parameter.
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Suspense fallback={<VitalsLoading />}>
        <VitalsContent packageName={packageName} />
      </Suspense>
    </div>
  )
}