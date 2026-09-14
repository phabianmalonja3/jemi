"use client"

export default function VitalsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 space-y-3">
      <h2 className="text-lg font-semibold text-red-800">Failed to load vitals</h2>
      <p className="text-sm text-red-700">{error.message}</p>
      <button
        onClick={reset}
        className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  )
}