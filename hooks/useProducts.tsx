// import useSWR from "swr";

// interface DATA {
//   productName: string;
//   expirationDate: string;
//   quantity: number;
//   id: string;
// }

// type TSWR = {
//   data: DATA[];
//   error: unknown;
//   isLoading: boolean;
// };

// export default function useProducts(url: string) {
//   type Fetcher<T> = (url: string) => Promise<T>;

//   const fetcher: Fetcher<any> = async (url) => {
//     const res = await fetch(url);
//     if (!res.ok) {
//       throw new Error("Failed to fetch data");
//     }
//     return res.json();
//   };

//   const { data, error, isLoading }: TSWR = useSWR(url, fetcher);

//   return {
//     data,
//     error,
//     isLoading,
//   };
// }

// useTrucks.js
// import useSWR from "swr";
// import {   } from "@/fetcher/fetchProducts";

// export default function useLocations() {
//   const { data, error, isLoading } = useSWR(
//     "/api/inventory/products/find",
//     fetchProducts,
//     {
//       refreshInterval: 1200,
//     }
//   );
//   return {
//     products: data,
//     isLoading,
//     error,
//   };
// }
