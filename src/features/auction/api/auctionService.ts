import api from "@/lib/axios";
import { Auction, AuctionListResponse, CreateAuctionValues } from "../types";
import { toCreateAuctionDTO } from "../utils/transformers";

export const auctionService = {
  getAll: async (page = 1, limit = 10) => {
    // We send query params for pagination
    const response = await api.get<AuctionListResponse>(`/auctions?page=${page}&limit=${limit}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Auction}>(`/auction/${id}`);
    return response.data;
  },
  
  create: async (formData: CreateAuctionValues) => {
    const payload = toCreateAuctionDTO(formData);
    // We send data exactly as the backend expects
    const response = await api.post("/auctions", payload);
    return response.data;
  }
};