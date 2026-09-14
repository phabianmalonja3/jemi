export default function StatusLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  )
}