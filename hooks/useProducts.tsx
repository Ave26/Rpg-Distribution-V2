import useSWR from "swr";

interface DATA {
  productName: string;
  expirationDate: string;
  quantity: number;
  id: string;
}

export default function useProducts(url: string) {
  type Fetcher<T> = (url: string) => Promise<T>;

  const fetcher: Fetcher<any> = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  };

  const {
    data,
    error,
    isLoading,
  }: { data: DATA[]; error: any; isLoading: boolean } = useSWR(url, fetcher);

  return {
    data,
    error,
    isLoading,
  };
}
