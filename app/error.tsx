"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 text-center">
      <div className="w-16 h-16 bg-f1red/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl">!</span>
      </div>
      <h1 className="text-3xl font-black text-white mb-3">
        Something went wrong
      </h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        A data request failed. This usually means the upstream API is temporarily unavailable.
      </p>
      <button
        onClick={reset}
        className="bg-f1red hover:bg-[#c8001f] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
