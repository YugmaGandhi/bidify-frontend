export interface Auction {
  id: string;
  title: string;
  description: string;
  currentPrice: number;
  startingPrice: number;
  endTime: string;
  imageUrl?: string; // Optional if we haven't added images yet
  status: "ACTIVE" | "CLOSED" | "SOLD";
  seller: {
    name: string;
    email: string;
  };
}

export interface AuctionListResponse {
  success: boolean;
  data: Auction[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
  };
}