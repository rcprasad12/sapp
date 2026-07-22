"use client";

import { useState, useEffect } from "react";

type Comment = {
  id: string;
  content: string;
  author: {
    username: string;
  };
};

type Post = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    username: string;
    avatar: string | null;
  };
  likes: { userId: string }[];
  comments: { id: string }[];
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  async function fetchPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handlePost() {
    if (!content.trim()) return;
    setLoading(true);
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    setContent("");
    setLoading(false);
    fetchPosts();
  }

  async function handleLike(postId: string) {
    await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    fetchPosts();
  }

  async function fetchComments(postId: string) {
    const res = await fetch(`/api/posts/${postId}/comment`);
    const data = await res.json();
    setComments(data);
  }

  async function handleComment(postId: string) {
    if (!commentText.trim()) return;
    await fetch(`/api/posts/${postId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: commentText }),
    });
    setCommentText("");
    fetchComments(postId);
    fetchPosts();
  }

  function toggleComments(postId: string) {
    if (openComments === postId) {
      setOpenComments(null);
    } else {
      setOpenComments(postId);
      fetchComments(postId);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 max-w-2xl mx-auto">
      <div className="border border-gray-800 rounded-2xl p-4 mb-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-transparent text-white outline-none resize-none text-lg placeholder-gray-600"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handlePost}
            disabled={loading}
            className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                {post.author.username[0].toUpperCase()}
              </div>
              <span className="font-semibold">@{post.author.username}</span>
            </div>
            <p className="text-gray-200">{post.content}</p>
            <div className="flex gap-4 mt-3 text-gray-500 text-sm">
              <button
                onClick={() => handleLike(post.id)}
                className="hover:text-red-500 transition-colors"
              >
                ❤️ {post.likes.length}
              </button>
              <button
                onClick={() => toggleComments(post.id)}
                className="hover:text-blue-400 transition-colors"
              >
                💬 {post.comments.length}
              </button>
            </div>

            {openComments === post.id && (
              <div className="mt-4 border-t border-gray-800 pt-4">
                <div className="flex flex-col gap-2 mb-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2 text-sm">
                      <span className="text-gray-400">@{comment.author.username}</span>
                      <span className="text-gray-200">{comment.content}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg outline-none border border-gray-700 text-sm"
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}


