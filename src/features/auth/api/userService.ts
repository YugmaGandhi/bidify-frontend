import api from "@/lib/axios";
import { Auction } from "@/features/auction/types";

// Define the shape of a Bid with its Auction
export interface MyBid {
    id: string;
    amount: string;
    createdAt: string;
    auction: Auction; 
}

export const userService = {
    getMyBids: async () => {
        const response = await api.get<{ data: MyBid[] }>("/users/bids");
        return response.data;
    },
    
    getMyAuctions: async () => {
        const response = await api.get<{ data: Auction[] }>("/users/auctions");
        return response.data;
    }
};