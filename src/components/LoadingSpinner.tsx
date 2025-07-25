export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  )
}
