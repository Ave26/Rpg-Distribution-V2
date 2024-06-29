import { fetchProductReport } from "@/fetcher/fetchProductReport";
import useSWR from "swr";

export default function useProductReport() {
  const { data, error, isLoading } = useSWR(
    "/api/logs/report/product",
    fetchProductReport,
    {
      refreshInterval: 1200,
    }
  );
  return {
    product: data,
    isLoading,
    error,
  };
}
