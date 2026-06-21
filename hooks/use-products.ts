"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Discount {
  id: string;
  type: "PERMANENT" | "TEMPORARY";
  percentage: string;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  productId: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: string;
  stock: number;
  isActive: boolean;
  categoryId: string;
  category: { id: string; name: string };
  discounts?: Discount[];
}

export interface ProductInput {
  name: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  categoryId: string;
  isActive: boolean;
  discountPercentage?: number;
  discountType?: "PERMANENT" | "TEMPORARY";
  discountStartsAt?: string;
  discountEndsAt?: string | null;
}

export function useProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await api.get<AdminProduct[]>("/admin/products");
      return data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput) => {
      const { data } = await api.post("/admin/products", input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput) => {
      const { data } = await api.patch(`/admin/products/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/products/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });
}