import { Suspense } from "react"
import StatusLoading from "./loading"

type StatusResponse = {
  packageName: string
  success: boolean
  message: string
}

async function fetchStatus(packageName: string): Promise<StatusResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v0.1"
  const res = await fetch(
    `${baseUrl}/google-play/check-status?packageName=${encodeURIComponent(packageName)}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? "Failed to check status")
  }

  return res.json()
}

async function StatusContent({ packageName }: { packageName: string }) {
  const data = await fetchStatus(packageName)

  const isOk = data.success
  const color = isOk
    ? "border-green-200 bg-green-50 text-green-800"
    : "border-red-200 bg-red-50 text-red-800"

  const dotColor = isOk ? "bg-green-500" : "bg-red-500"

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Connection Status</h1>
        <p className="text-sm text-gray-500 font-mono">{data.packageName}</p>
      </header>

      <div className={`rounded-lg border p-5 ${color}`}>
        <div className="flex items-center gap-3">
          <span className={`inline-block h-3 w-3 rounded-full ${dotColor} animate-pulse`} />
          <span className="font-medium">
            {isOk ? "Connected" : "Connection failed"}
          </span>
        </div>
        <p className="mt-2 text-sm">{data.message}</p>
      </div>

      <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
        <p>
          This endpoint verifies that the configured service account can reach the
          given app on Google Play.
        </p>
      </div>
    </div>
  )
}

export default async function StatusPage({
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
    <div className="p-6 max-w-2xl mx-auto">
      <Suspense fallback={<StatusLoading />}>
        <StatusContent packageName={packageName} />
      </Suspense>
    </div>
  )
}