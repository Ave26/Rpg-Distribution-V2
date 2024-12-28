import { fetchRoles } from "@/fetcher/fetchRoles";
import useSWR from "swr";

export default function useRoles() {
  const { data, error, isLoading } = useSWR("/api/user/roles", fetchRoles, {
    refreshInterval: 1200,
  });
  return {
    roles: data,
    isLoading,
    error,
  };
}
