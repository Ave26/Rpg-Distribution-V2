// useTrucks.js
import useSWR from "swr";
import { fetchRecords } from "@/fetcher/fetchRecord";

export default function useRecords() {
  const { data, error, isLoading } = useSWR("/api/logs/record", fetchRecords, {
    refreshInterval: 1200,
  });
  return {
    records: data,
    isLoading,
    error,
  };
}
