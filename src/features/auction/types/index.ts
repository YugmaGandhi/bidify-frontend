import z from "zod";

export interface Auction {
  id: string;
  title: string;
  description: string;
  currentPrice: string;
  startingPrice: string;
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

export const createAuctionSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 char"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startingPrice: z.coerce.number().min(1, "Price must be at least $1"), // coerce handles string -> number conversion
  endTime: z.string().refine((val) => new Date(val) > new Date(), {
    message: "End time must be in the future",
  }),
});

export type CreateAuctionValues = z.infer<typeof createAuctionSchema>

export interface CreateAuctionDTO {
  title: string;
  description: string;
  startingPrice: number;
  endTime: string; // ISO string
  startTime?: string; // ISO string, optional - backend can set this to current time if not provided
  imageUrl?: string; // Optional for now, we can add image upload later
}