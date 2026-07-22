"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type UserProfile = {
  id: string;
  username: string;
  bio: string | null;
  avatar: string | null;
  isFollowing: boolean;
  _count: {
    followers: number;
    following: number;
    posts: number;
  };
  posts: {
    id: string;
    content: string;
    likes: { userId: string }[];
    comments: { id: string }[];
  }[];
};

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchProfile() {
    if (!username) return;
    const res = await fetch(`/api/users/${username}`);
    const data = await res.json();
    setProfile(data);
  }

  useEffect(() => {
    fetchProfile();
  }, [username]);

  async function handleFollow() {
    if (!profile) return;
    setLoading(true);
    await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: profile.username }),
    });
    setLoading(false);
    fetchProfile();
  }

  if (!username) {
    return (
      <main className="min-h-screen bg-black text-white px-4 py-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-400">No user selected.</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-black text-white px-4 py-8 max-w-2xl mx-auto">
        <p className="text-gray-400">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 max-w-2xl mx-auto">
      <div className="border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold">
              {profile.username[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">@{profile.username}</h1>
              {profile.bio && (
                <p className="text-gray-400 mt-1">{profile.bio}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleFollow}
            disabled={loading}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              profile.isFollowing
                ? "border border-gray-600 text-white hover:border-red-500 hover:text-red-500"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {loading ? "..." : profile.isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>

        <div className="flex gap-6 text-sm text-gray-400">
          <span><strong className="text-white">{profile._count.posts}</strong> posts</span>
          <span><strong className="text-white">{profile._count.followers}</strong> followers</span>
          <span><strong className="text-white">{profile._count.following}</strong> following</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {profile.posts.map((post) => (
          <div key={post.id} className="border border-gray-800 rounded-2xl p-4">
            <p className="text-gray-200">{post.content}</p>
            <div className="flex gap-4 mt-3 text-gray-500 text-sm">
              <span>❤️ {post.likes.length}</span>
              <span>💬 {post.comments.length}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

