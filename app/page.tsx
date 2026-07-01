import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-5xl font-bold mb-4"> Welcome to SocialApp</h1>
      <p className="text-gray-400 text-xl mb-8">connect with people , share your momentss.</p>
      <div className="flex gap-4">
        <Link href="/feed" className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200">
         Get Started
        </Link>
        <Link href="/login" className="border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black">
          Login 
        </Link>
      </div>


    </main>
  )
}
