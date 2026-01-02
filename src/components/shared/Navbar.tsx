"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { authService } from "@/features/auth/api/authService";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Navbar = () => {
    const router = useRouter();

    const handleLogout = () => {
        authService.logout();
        toast.success("Logged out successfully");
        router.push("/login");
    }

    return (
    <nav className="border-b bg-white px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link href="/dashboard" className="text-xl font-bold text-blue-600">
        Bidify
      </Link>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/auctions">Auctions</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/dashboard/my-bids">My Bids</Link>
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};