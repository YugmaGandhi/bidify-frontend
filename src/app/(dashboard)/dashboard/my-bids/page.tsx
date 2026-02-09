"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/features/auth/api/userService";
import { Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MyBidsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-bids"],
    queryFn: userService.getMyBids,
  });

  if (isLoading) return <div className="flex justify-center mt-10"><Loader2 className="animate-spin" /></div>;

  const bids = data?.data || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Bidding History</h1>
      
      {bids.length === 0 ? (
        <p className="text-gray-500">You haven&apos;t placed any bids yet.</p>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => {
            const isWinning = parseFloat(bid.amount) >= parseFloat(bid.auction.currentPrice);
            const isEnded = new Date(bid.auction.endTime) < new Date();

            return (
              <Card key={bid.id} className="flex flex-row items-center justify-between p-4">
                 <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-lg">{bid.auction.title}</h3>
                    <p className="text-sm text-gray-500">
                        Bid Amount: <span className="font-bold text-green-600">${bid.amount}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                        Placed on: {new Date(bid.createdAt).toLocaleDateString()}
                    </p>
                 </div>

                 <div className="flex items-center gap-4">
                    {/* Status Logic */}
                    {isEnded ? (
                        <Badge variant={isWinning ? "default" : "destructive"}>
                            {isWinning ? "Won!" : "Lost"}
                        </Badge>
                    ) : (
                        <Badge variant="outline" className={isWinning ? "border-green-500 text-green-600" : "border-yellow-500 text-yellow-600"}>
                            {isWinning ? "Winning" : "Outbid"}
                        </Badge>
                    )}

                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/auctions/${bid.auction.id}`}>
                            <ExternalLink className="h-4 w-4" />
                        </Link>
                    </Button>
                 </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}