"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black border-b border-gray-800">
      <span className="text-white font-bold text-xl">SocialApp</span>

      {/* Desktop links */}
      <div className="hidden md:flex gap-6">
        <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
        <Link href="/feed" className="text-gray-400 hover:text-white">Feed</Link>
        <Link href="/search" className="text-gray-400 hover:text-white">Search</Link>
        <Link href="/profile" className="text-gray-400 hover:text-white">Profile</Link>
        <Link href="/messages" className="text-gray-400 hover:text-white">Messages</Link>
        <Link href="/notifications" className="text-gray-400 hover:text-white">Notifications</Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black border-b border-gray-800 flex flex-col px-6 py-4 gap-4 md:hidden z-50">
          <Link href="/" className="text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/feed" className="text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>Feed</Link>
          <Link href="/search" className="text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>Search</Link>
          <Link href="/profile" className="text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>Profile</Link>
          <Link href="/messages" className="text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>Messages</Link>
          <Link href="/notifications" className="text-gray-400 hover:text-white" onClick={() => setMenuOpen(false)}>Notifications</Link>
        </div>
      )}
    </nav>
  );
}

