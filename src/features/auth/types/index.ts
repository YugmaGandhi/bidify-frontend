import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
    email: z.email("Please enter valid email"),
    password: z.string().min(1, "Password si required"),
});

// Register Schema
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// TypeScript Types inferred from Zod
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;