import { CreateAuctionDTO, CreateAuctionValues } from "../types";

export const toCreateAuctionDTO = (formvalues: CreateAuctionValues) : CreateAuctionDTO => {
    // 1. Handle Date Conversion (Local -> UTC ISO)
    // The HTML input gives "2026-02-06T14:30" (Local Time)
    // We must convert this to "2026-02-06T09:00:00.000Z" (UTC)
    const utcDate = new Date(formvalues.endTime).toISOString();

    // 2. Construct DTO
    return {
        title: formvalues.title,
        description: formvalues.description,
        startingPrice: formvalues.startingPrice,
        endTime: utcDate,
        // We explicitly decide strict defaults here, not in the view layer
        imageUrl: "", 
        // We can add logic: if user didn't pick a start time, don't send it (let backend decide)
    };
};