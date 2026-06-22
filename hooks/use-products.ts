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
  brandId: string;
  brand: { id: string; name: string };
  categories: { id: string; name: string }[];
  discounts?: Discount[];
}

export interface ProductInput {
  name: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  brandId: string;
  categories: string[];
  isActive: boolean;
  discountPercentage?: number;
  discountType?: "PERMANENT" | "TEMPORARY";
  discountStartsAt?: string;
  discountEndsAt?: string | null;
}

export function useProducts(params?: Record<string, string | string[]>) {
  return useQuery({
    queryKey: ["admin-products", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
             if (Array.isArray(value)) {
                value.forEach(v => searchParams.append(key, v));
             } else {
                searchParams.append(key, value.toString());
             }
          }
        });
      }
      const qs = searchParams.toString();
      const url = `/admin/products${qs ? `?${qs}` : ""}`;
      const { data } = await api.get<AdminProduct[]>(url);
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