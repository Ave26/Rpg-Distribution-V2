import useSWR from "swr";
import { bins, Prisma } from "@prisma/client";
import { TAssignedProducts } from "@/fetcher/fetchProducts";

type Orders = Prisma.orderGetPayload<{
  include: {
    _count: { select: { assignedProducts: true } };
    locations: { select: { name: true } };
    trucks: { select: { truckName: true } };
  };
}>;

async function fetchOrders(url: string): Promise<Orders[]> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export default function useOrders() {
  const { data, error, isLoading } = useSWR(
    "/api/picking-and-packing/get-orders",
    fetchOrders,
    {
      refreshInterval: 1200,
    }
  );
  return {
    orderData: data,
    isLoading,
    error,
  };
}
