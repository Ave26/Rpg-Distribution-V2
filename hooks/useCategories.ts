// useTrucks.js
import { fetchCategories } from "@/fetcher/fetchCategories";
import useSWR from "swr";

export default function useDamageCategories() {
  const { data, error, isLoading } = useSWR(
    `/api/inventory/categories/find`,
    fetchCategories,
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
