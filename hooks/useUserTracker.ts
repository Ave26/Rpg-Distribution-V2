// useTrucks.js
import { fetchUserTracker } from "@/fetcher/fetchUserTracker";
import useSWR from "swr";

export default function userUserTracker() {
  const { data, error, isLoading } = useSWR(
    `/api/user/find`,
    fetchUserTracker,
    {
      refreshInterval: 1200,
    }
  );
  return {
    users: data,
    isLoading,
    error,
  };
}