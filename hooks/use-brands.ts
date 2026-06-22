"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export function useBrands() {
  return useQuery({
    queryKey: ["admin-brands"],
    queryFn: async () => {
      const { data } = await api.get<Brand[]>("/admin/brands");
      return data;
    },
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string }) => {
      const { data } = await api.post("/admin/brands", input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-brands"] }),
  });
}

export function useUpdateBrand(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string }) => {
      const { data } = await api.patch(`/admin/brands/${id}`, input);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-brands"] }),
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/brands/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-brands"] }),
  });
}
