"use client";

import { useQuery } from "@tanstack/react-query";
import { auctionService } from "@/features/auction/api/auctionService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // 1. TanStack Query Hook
  // It handles isLoading, error, and data caching automatically!
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auctions"], // Unique key for caching
    queryFn: () => auctionService.getAll(),
  });

  if (isLoading) {
    return <div className="flex justify-center mt-10"><Loader2 className="animate-spin h-8 w-8 text-blue-500"/></div>;
  }

  if (isError) {
    return <div className="text-red-500 text-center mt-10">Failed to load auctions.</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Active Auctions</h1>
        <Button asChild>
            <Link href="/dashboard/auctions/create">Create Auction</Link>
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.map((auction) => (
          <Card key={auction.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{auction.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 line-clamp-2 mb-4">{auction.description}</p>
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-green-600">
                  ${auction.currentPrice}
                </span>
                <span className="text-gray-400">
                  Ends: {new Date(auction.endTime).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Place Bid</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}