import React, { useEffect } from "react";
import { getSupabase } from "@/integrations/supabase/client";
import { useLocationOrders, useUpdateOrderStatus, OrderStatus } from "@/hooks/useOrders";
import { Location } from "@/types";
import { useToast } from "@/hooks/use-toast";

const StaffDashboard: React.FC = () => {
  const { toast } = useToast();
  const supabase = getSupabase();

  const location = Location.MEDICAL; // or BITBITES depending on your logic
  const { orders, refetch } = useLocationOrders(location);
  const updateStatus = useUpdateOrderStatus();

  // ---------------- REALTIME SUBSCRIPTION ----------------
  useEffect(() => {
    if (!supabase) {
      toast({
        title: "Realtime disabled",
        description: "Supabase not configured. Live updates unavailable.",
        variant: "destructive",
      });
      return;
    }

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, refetch, toast]);

  // ---------------- UI ----------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>

      {orders?.length === 0 && (
        <p className="text-muted-foreground">No orders available</p>
      )}

      <div className="space-y-4">
        {orders?.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">Order #{order.token}</p>
              <p className="text-sm text-muted-foreground">
                Status: {order.status}
              </p>
            </div>

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus.mutate({
                  orderId: order.id,
                  status: e.target.value as OrderStatus,
                })
              }
              className="border rounded px-2 py-1"
            >
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard;
