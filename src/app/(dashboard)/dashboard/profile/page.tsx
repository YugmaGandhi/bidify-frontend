"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/features/auth/api/userService";
import { Loader2, Plus, Package, CheckCircle } from "lucide-react";
import Link from "next/link";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
  // 1. Fetch My Listings
  const { data: auctionsData, isLoading } = useQuery({
    queryKey: ["my-auctions"],
    queryFn: userService.getMyAuctions,
  });

  // (Ideally, we would also fetch user details from an endpoint like /auth/me, 
  // but for now, we can read basic info from the stored token or just display static placeholders
  // until we build that specific endpoint. Let's assume we decode the token or just show 'My Profile').
  const user = {
    name: "My Account", // You can get this from a Context or decoded Token later
    role: "Seller"
  };

  if (isLoading) return <div className="flex justify-center mt-10"><Loader2 className="animate-spin" /></div>;

  const myAuctions = auctionsData?.data || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <div className="flex items-center gap-2 text-gray-500">
                    <span className="text-sm">Active Member</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                </div>
            </div>
        </div>
        
        <Button asChild>
            <Link href="/dashboard/auctions/create">
                <Plus className="mr-2 h-4 w-4" /> List New Item
            </Link>
        </Button>
      </div>

      {/* 2. Content Tabs */}
      <Tabs defaultValue="listings" className="w-full">
        <TabsList>
          <TabsTrigger value="listings">My Listings ({myAuctions.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {/* MY LISTINGS TAB */}
        <TabsContent value="listings" className="mt-6">
            {myAuctions.length === 0 ? (
                <Card className="text-center py-10">
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500">You haven&apos;t listed any items for sale yet.</p>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/auctions/create">Create your first listing</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myAuctions.map((auction) => (
                        <Card key={auction.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg line-clamp-1">{auction.title}</CardTitle>
                                    <Badge variant={new Date(auction.endTime) > new Date() ? "default" : "secondary"}>
                                        {new Date(auction.endTime) > new Date() ? "Active" : "Ended"}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Ends: {new Date(auction.endTime).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-2xl font-bold">${auction.currentPrice}</p>
                                <p className="text-sm text-gray-500 mt-1">Starting Price: ${auction.startingPrice}</p>
                            </CardContent>
                            <div className="p-4 pt-0 mt-auto">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href={`/dashboard/auctions/${auction.id}`}>
                                        View Auction
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </TabsContent>

        {/* SETTINGS TAB (Placeholder) */}
        <TabsContent value="settings">
            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your preferences and security.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">Settings functionality coming soon...</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}