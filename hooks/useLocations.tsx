// useTrucks.js
import useSWR from "swr";
import { fetchLocations } from "@/fetcher/fetchLocations";

export default function useLocations() {
  const { data, error, isLoading } = useSWR(
    "/api/location/find",
    fetchLocations,
    {
      refreshInterval: 1200,
    }
  );
  return {
    locations: data,
    isLoading,
    error,
  };
}
