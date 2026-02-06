import api from "@/lib/axios";

// Define the response type (matches Backend ApiResponse)
export interface BidResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    amount: number;
    userId: string;
    auctionId: string;
    createdAt: string;
  };
}

export const bidService = {
  /**
   * Place a new bid on an auction.
   * @param auctionId - The UUID of the auction
   * @param amount - The numeric amount (must be higher than current price)
   */
  placeBid: async (auctionId: string, amount: number) => {
    // The backend expects { auctionId, amount } in the body
    const response = await api.post<BidResponse>("/bids", { 
      auctionId, 
      amount 
    });
    return response.data;
  },
  
  /**
   * (Optional) Fetch bid history for an auction
   * We haven't built this UI yet, but this is where it would go.
   */
  getHistory: async (auctionId: string) => {
    // Assuming you might add a GET /auctions/:id/bids endpoint later
    const response = await api.get(`/auctions/${auctionId}/bids`);
    return response.data;
  }
};