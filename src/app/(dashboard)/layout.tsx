"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Basic Client-Side Protection
  // (In a real app, Middleware is better, but this is fine for learning)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
}