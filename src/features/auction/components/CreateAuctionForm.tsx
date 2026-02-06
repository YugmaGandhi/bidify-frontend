"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createAuctionSchema, CreateAuctionValues } from "../types";
import { auctionService } from "../api/auctionService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const CreateAuctionForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(createAuctionSchema),
    defaultValues: {
      title: "",
      description: "",
      startingPrice: 0,
      endTime: "",
    },
  });

  const onSubmit = async (values: CreateAuctionValues) => {
    setIsLoading(true);
    try {
      await auctionService.create(values);
      toast.success("Auction created successfully!");
      router.push("/dashboard"); // Redirect to list
    } catch (error: any) {
      // This is where your BACKEND error messages shine
      // If user is unverified, backend sends 403. Frontend shows toast.
      toast.error(error.response?.data?.message || "Failed to create auction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Title</FormLabel>
              <FormControl>
                <Input placeholder="Vintage Camera 1950s..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the item condition..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="startingPrice"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Starting Price ($)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="100" {...field} value={(field.value as number) || ''} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel>End Date & Time</FormLabel>
                <FormControl>
                    <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
            </>
          ) : (
            "List Item"
          )}
        </Button>
      </form>
    </Form>
  );
};