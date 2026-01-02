import api from "@/lib/axios";
import { AuctionListResponse } from "../types";

export const auctionService = {
  getAll: async (page = 1, limit = 10) => {
    // We send query params for pagination
    const response = await api.get<AuctionListResponse>(`/auctions?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  // Placeholder for later
  create: async (data: any) => {
    return api.post("/auctions", data);
  }
};