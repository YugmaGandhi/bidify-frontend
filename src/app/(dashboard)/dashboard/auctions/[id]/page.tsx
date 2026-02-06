"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ArrowLeft, Clock, DollarSign, User } from "lucide-react";
import { toast } from "sonner";

// Services and Utils
import { auctionService } from "@/features/auction/api/auctionService";
import { socket } from "@/lib/socket";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PlaceBidForm } from "@/features/auction/components/PlaceBidForm";

export default function AuctionDetailPage() {
  const params = useParams();
  // Ensure we safely handle the potentially array-like param
  const auctionId = Array.isArray(params.id) ? params.id[0] : params.id;
  const queryClient = useQueryClient();

  // 1. Fetch Initial Data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auction", auctionId],
    queryFn: () => auctionService.getById(auctionId as string),
    enabled: !!auctionId, // Only run if ID exists
  });

  // 2. Real-Time Socket Connection
  useEffect(() => {
    if (!auctionId) return;

    // Connect to Socket
    if (!socket.connected) {
      socket.connect();
    }

    // Join the specific room for this auction
    socket.emit("join_auction", auctionId);

    // Listen for Bid Updates
    const handleBidUpdate = (payload: any) => {
      console.log("⚡ Real-time update:", payload);
      
      // Notify the user
      toast.info(`New bid placed: $${payload.latestBid.amount}`);

      // Optimistically update the cache so the UI reflects the price instantly
      queryClient.setQueryData(["auction", auctionId], (oldData: any) => {
        if (!oldData || !oldData.data) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            currentPrice: payload.currentPrice,
            // If you wanted to update a bid history list, you would do it here too
          }
        };
      });
    };

    socket.on("bid:update", handleBidUpdate);

    // Cleanup on unmount
    return () => {
      socket.off("bid:update", handleBidUpdate);
      socket.emit("leave_auction", auctionId);
      // We generally don't disconnect the socket entirely if navigation is frequent,
      // but for this specific implementation, it's safer to disconnect or leave room.
    };
  }, [auctionId, queryClient]);

  // 3. Loading State
  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // 4. Error State
  if (isError || !data?.data) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <h2 className="text-2xl font-bold text-destructive">Auction Not Found</h2>
        <p className="text-muted-foreground">The auction you are looking for does not exist or has been removed.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const auction = data.data;
  const isEnded = new Date(auction.endTime) < new Date();

  return (
    <div className="container mx-auto max-w-5xl py-6">
      {/* Navigation */}
      <Button variant="ghost" asChild className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
        <Link href="/dashboard" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Auctions
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        {/* LEFT COLUMN: Image & Details */}
        <div className="space-y-6">
          {/* Image Placeholder */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 border shadow-sm flex items-center justify-center">
             {auction.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={auction.imageUrl} 
                  alt={auction.title} 
                  className="h-full w-full object-cover"
                />
             ) : (
                <div className="flex flex-col items-center text-slate-400">
                    <div className="h-16 w-16 rounded-full bg-slate-200 mb-2"></div>
                    <p>No Image Available</p>
                </div>
             )}
             
             {/* Status Badge */}
             <div className="absolute top-4 right-4">
                <Badge variant={isEnded ? "secondary" : "default"} className={isEnded ? "bg-slate-500" : "bg-green-600 hover:bg-green-700"}>
                    {isEnded ? "Ended" : "Live"}
                </Badge>
             </div>
          </div>

          {/* Description Card */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-slate-600 leading-relaxed">
                {auction.description}
              </p>
            </CardContent>
          </Card>

          {/* Seller Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="text-base">Seller Information</CardTitle>
                    <p className="text-sm text-muted-foreground">Trusted Vendor</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{auction.seller.name}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="font-medium">{auction.seller.email}</span>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Bidding Action */}
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    {auction.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                    Auction ID: <span className="font-mono text-xs">{auction.id}</span>
                </p>
            </div>

            <Card className="border-2 border-primary/10 bg-slate-50/50 shadow-lg">
                <CardContent className="p-6 space-y-6">
                    {/* Price Display */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1">
                                <DollarSign className="h-3 w-3" /> Current Price
                            </p>
                            <p className="text-4xl font-black text-primary tracking-tight">
                                ${auction.currentPrice.toLocaleString()}
                            </p>
                        </div>
                        <div className="text-right">
                             <p className="text-sm font-medium text-slate-500 mb-1 flex items-center justify-end gap-1">
                                <Clock className="h-3 w-3" /> Ends In
                            </p>
                            <p className="text-lg font-semibold text-slate-700">
                                {new Date(auction.endTime).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(auction.endTime).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Bidding Form */}
                    {isEnded ? (
                        <div className="rounded-lg bg-slate-200 p-4 text-center font-medium text-slate-600">
                            This auction has ended.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700 border border-blue-100">
                                <p className="font-medium text-center">
                                    Top Bidder? You're one click away.
                                </p>
                            </div>
                            
                            {/* The Bidding Component */}
                            <PlaceBidForm 
                                auctionId={auction.id} 
                                currentPrice={parseFloat(auction.currentPrice)} 
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
            
            {/* Trust Badges (Visual only) */}
            <div className="grid grid-cols-2 gap-4 text-center text-sm text-slate-500">
                <div className="rounded-lg border bg-white p-3">
                    🛡️ Buyer Protection
                </div>
                <div className="rounded-lg border bg-white p-3">
                    🚀 Fast Shipping
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}