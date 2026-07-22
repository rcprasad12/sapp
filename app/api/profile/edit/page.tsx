"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user?.name) return;
      const res = await fetch(`/api/users/${session.user.name}`);
      if (!res.ok) return;
      const data = await res.json();
      setBio(data.bio || "");
      setAvatar(data.avatar || "");
    }
    fetchProfile();
  }, [session]);

  async function handleSubmit() {
    setLoading(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio, avatar }),
    });

    if (res.ok) {
      setMessage("Profile updated successfully!");
      setTimeout(() => router.push(`/profile?username=${session?.user?.name}`), 1000);
    } else {
      setMessage("Failed to update profile.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-gray-400 text-sm mb-2 block">Avatar URL</label>
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl outline-none border border-gray-700 focus:border-white"
          />
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-2 block">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about yourself..."
            rows={4}
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl outline-none border border-gray-700 focus:border-white resize-none"
          />
        </div>

        {message && (
          <p className="text-green-400 text-sm">{message}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </main>
  );
}

