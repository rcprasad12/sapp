import Link from "next/link";

export default function Navbar() {
  return (
    <nav className = "flex items-center justify-between px-6 py-4 bg-black border-b border-gray-800">
      <span className="text-white font-bold text-xl">Social App</span>
      <div className="flex gap-6">
      <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
      <Link href="/feed" className="text-gray-400 hover:text-white">Feed</Link>
      <Link href="/profile" className="text-gray-400 hover:text:white">Profile</Link>
      <Link href="/messages" className="text-gray-400 hover:text-white">Messages</Link>
      <Link href="/notifications" className="text-gray-400 hover:text-white">Notifications</Link>
      </div>
    </nav>
  );
}


