"use client";

import { CreateAuctionForm } from "@/features/auction/components/CreateAuctionForm";

export default function CreateAuctionPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">List New Item</h1>
      <CreateAuctionForm />
    </div>
  );
}