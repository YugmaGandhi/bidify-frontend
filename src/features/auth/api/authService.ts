import api from "@/lib/axios";
import { LoginFormValues, RegisterFormValues } from "../types";

export const authService = {
    login: async (data: LoginFormValues) => {
        const response = await api.post("/auth/login", data);
        return response.data;
    },

    register: async (data: RegisterFormValues) => {
        const response = await api.post("/auth/register", data);
        return response.data;
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem("token");
            // TODO: Optional: Remove user from Zustand store
        }
    }
};