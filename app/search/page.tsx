"use client";

import { useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  username: string;
  avatar: string | null;
  bio: string | null;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/search?q=${value}`);
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <input
        value={query}
        onChange={handleSearch}
        placeholder="Search users..."
        className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl outline-none border border-gray-700 focus:border-white mb-6"
      />

      {loading && <p className="text-gray-400">Searching...</p>}

      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/profile?username=${user.username}`}
            className="flex items-center gap-3 p-4 border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">@{user.username}</p>
              {user.bio && (
                <p className="text-gray-400 text-sm">{user.bio}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}


