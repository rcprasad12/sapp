"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if(result?.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        router.push("/");
        
    }

    return (
        <main className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-full max-w-md p-8 border border-gray-800 rounded-2xl">
    )
