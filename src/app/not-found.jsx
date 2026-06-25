"use client"
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <svg viewBox="0 0 240 200" className="w-64 h-52 mx-auto mb-6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="100" rx="95" ry="20" stroke="#27272a" strokeWidth="1.5" strokeDasharray="4 5" />
          <rect x="70" y="90" width="80" height="55" rx="6" fill="#1c1c1e" stroke="#3f3f46" strokeWidth="2" />
          <path d="M70 105 L150 105" stroke="#3f3f46" strokeWidth="2" />
          <path d="M95 90 L95 70 L125 70 L125 90" stroke="#3f3f46" strokeWidth="2" fill="none" />
          <circle cx="168" cy="60" r="22" fill="#121214" stroke="#3b82f6" strokeWidth="4" />
          <line x1="184" y1="76" x2="200" y2="92" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
          <text x="160" y="65" fontSize="20" fill="#3b82f6" fontWeight="bold" textAnchor="middle">?</text>
          <circle cx="45" cy="60" r="4" fill="#3f3f46" />
          <circle cx="200" cy="140" r="5" fill="#3f3f46" />
          <circle cx="55" cy="150" r="3" fill="#3f3f46" />
        </svg>

        <h1 className="text-5xl font-bold tracking-tight">404</h1>
        <h2 className="text-lg font-medium mt-2 text-zinc-200">Page not found</h2>
        <p className="text-zinc-500 text-sm mt-2">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link href="/" className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 rounded-lg px-6 h-11 leading-[44px] text-sm font-semibold transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}