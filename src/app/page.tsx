"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace("/dashboard");
  }, [isLoaded, isSignedIn, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-xl px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">THEA</h1>
        <p className="text-xl text-gray-500 mb-8">
          Your team&apos;s knowledge — captured, organized, and findable in
          seconds.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-up"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Get started free
          </Link>
          <Link
            href="/sign-in"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
