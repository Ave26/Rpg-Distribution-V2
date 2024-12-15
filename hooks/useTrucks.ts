// useTrucks.js
import useSWR from "swr";
import { fetchTrucks } from "@/fetcher/fetchTrucks";

export default function useTrucks() {
  const { data, error, isLoading } = useSWR("/api/trucks/find", fetchTrucks, {
    refreshInterval: 1200,
  });
  return {
    trucks: data,
    isLoading,
    error,
  };
}
