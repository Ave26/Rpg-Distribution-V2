// useTrucks.js
import { fetchBinLogReports } from "@/fetcher/fetchBinLogReports";
import useSWR from "swr";

export default function useBinLogReport() {
  const { data, error, isLoading } = useSWR(
    `/api/logs/report/bin`,
    fetchBinLogReports,
    {
      refreshInterval: 1200,
    }
  );
  return {
    binReport: data,
    isLoading,
    error,
  };
}
