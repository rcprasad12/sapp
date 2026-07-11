"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md p-8 border border-gray-800 rounded-2xl">
        <h1 className="text-white text-3xl font-bold mb-2">Create account</h1>
        <p className="text-gray-400 mb-8">Join SocialApp today</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="bg-gray-900 text-white px-4 py-3 rounded-lg outline-none border border-gray-700 focus:border-white"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="bg-gray-900 text-white px-4 py-3 rounded-lg outline-none border border-gray-700 focus:border-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="bg-gray-900 text-white px-4 py-3 rounded-lg outline-none border border-gray-700 focus:border-white"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}