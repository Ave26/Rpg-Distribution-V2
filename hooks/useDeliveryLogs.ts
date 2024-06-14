// useTrucks.js
import useSWR from "swr";
import { fetchDeliveryLogs } from "@/fetcher/fetchDeliveryLogs";

export default function useDeliveryLogs() {
  const { data, error, isLoading } = useSWR(
    "/api/logs/delivery",
    fetchDeliveryLogs,
    {
      refreshInterval: 1200,
    }
  );
  return {
    deliveryLogs: data,
    isLoading,
    error,
  };
}
