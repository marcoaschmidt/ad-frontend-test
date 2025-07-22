'use client'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Something went wrong</h2>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-red-500 text-xs mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}