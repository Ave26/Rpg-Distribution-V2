// useTrucks.js
import { fetchDamageCategories } from "@/fetcher/fetchDamageCategories";
import useSWR from "swr";

export default function useDamageCategories() {
  const { data, error, isLoading } = useSWR(
    "/api/inventory/category/find",
    fetchDamageCategories,
    {
      refreshInterval: 1200,
    }
  );
  return {
    categories: data,
    isLoading,
    error,
  };
}
