// useTrucks.js
import { fetchUserScanned } from "@/fetcher/fetchUserScanned";
import useSWR from "swr";

export default function useUserScanned() {
  const { data, error, isLoading } = useSWR(
    `/api/logs/report/user-scanned`,
    fetchUserScanned,
    {
      refreshInterval: 1200,
    }
  );
  return {
    userScanned: data,
    isLoading,
    error,
  };
}
