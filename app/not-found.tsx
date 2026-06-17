import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h1 className="text-8xl font-black text-white/10 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-3">Page not found</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        This page doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="bg-f1red hover:bg-[#c8001f] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Back home
      </Link>
    </main>
  );
}
