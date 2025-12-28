import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/integrations/supabase/client";
import { Location, CartItem } from "@/types";
import { API_BASE_URL, fetchConfig } from "@/api/config";

/* ---------------- TYPES ---------------- */

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed";

/* ---------------- HELPERS ---------------- */

const getCurrentUserId = async (): Promise<string | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
};

/* ---------------- HOOKS ---------------- */

export const useLocationOrders = (location: Location) => {
  return useQuery({
    queryKey: ["orders", location],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/orders/location/${location}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      return res.json();
    },
    refetchInterval: 5000,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: CartItem[]) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("User not authenticated");

      const res = await fetch(`${API_BASE_URL}/orders`, {
        ...fetchConfig,
        method: "POST",
        body: JSON.stringify({
          userId,
          items,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatus;
    }) => {
      const res = await fetch(
        `${API_BASE_URL}/orders/${orderId}/status`,
        {
          ...fetchConfig,
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update order status");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
