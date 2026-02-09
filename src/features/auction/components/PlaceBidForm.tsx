"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { bidService } from "../api/bidService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";

// 1. Define Schema
const bidSchema = z.object({
  amount: z.coerce.number().positive("Bid must be a positive amount"),
});

// 2. Infer the Type automatically
type BidFormValues = z.infer<typeof bidSchema>;

interface PlaceBidFormProps {
  auctionId: string;
  currentPrice: number;
}

export const PlaceBidForm = ({ auctionId, currentPrice }: PlaceBidFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const suggestedBid = currentPrice + 10;

  // 3. THE FIX: Remove <{ amount: number }>
  // Let useForm infer the type from the 'resolver'
  const form = useForm({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      amount: suggestedBid,
    },
  });

  // 4. Use the inferred type here
  const onSubmit = async (values: BidFormValues) => {
    if (values.amount <= currentPrice) {
      toast.error(`Your bid must be higher than the current price ($${currentPrice})`);
      return;
    }

    setIsLoading(true);
    try {
      await bidService.placeBid(auctionId, values.amount);
      toast.success("Bid placed successfully!");
      form.setValue("amount", values.amount + 10);

      // 1. Force the Auction Detail page to refresh (Double safety with Socket)
      await queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });

      // 2. Force the "My Bids" list to refresh so the new bid appears there
      await queryClient.invalidateQueries({ queryKey: ["my-bids"] });
      
      // 3. Force the Dashboard list to refresh (to show new price on card)
      await queryClient.invalidateQueries({ queryKey: ["auctions"] });

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place bid");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      $
                    </span>
                    <Input 
                        type="number" 
                        className="pl-7 text-lg font-semibold" 
                        placeholder="0.00"
                        {...field}
                        // 5. Explicit cast to handle 'unknown' -> 'number'
                        value={(field.value as number) || ''}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" size="lg" className="min-w-[120px]" disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <>
                    Bid Now <TrendingUp className="ml-2 h-4 w-4" />
                </>
            )}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
            Minimum valid bid is <strong>${(currentPrice + 1).toLocaleString()}</strong>
        </p>
      </form>
    </Form>
  );
};