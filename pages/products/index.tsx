import React, { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout";
import Loading from "@/components/Parts/Loading";
import Image from "next/image";
import { products } from "@prisma/client";
// import { findPublicProducts } from "@/lib/prisma/product";
// import { NextApiRequest } from "next";
// import { verifyJwt } from "@/lib/helper/jwt";
import noImg from "@/public/assets/products/noProductDisplay.png";
import useSWR from "swr";
interface DATA {
  barcodeId?: string;
  category?: string;
  image?: any;
  price?: number;
  productName?: string;
}

// interface Products {
//   id: string;
//   barcodeId: string;
//   category: string;
//   image: string;
//   price: number;
//   productName: string;
//   sku: null;
// }

async function fetcher(url: string): Promise<products[]> {
  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .catch((error) => {
      throw error;
    });
}

export default function Products({}: {
  data: any;
  products: DATA[];
  error: unknown;
}) {
  const [searchInput, setSearchInput] = useState<string>("");

  const { data: products, isLoading } = useSWR(
    "/api/public-products",
    fetcher,
    {
      refreshInterval: 3000,
    }
  );

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Layout>
        <section className="h-full w-full font-bold">
          <div className="flex h-full w-full items-center justify-center">
            {isLoading ? (
              <div className="flex h-screen animate-pulse items-center rounded-full px-3 py-1 text-center text-lg font-medium leading-none text-black">
                <Loading />
              </div>
            ) : (
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 p-5 transition-all md:flex-row">
                {products?.map((value: products, index: number) => {
                  return (
                    <div
                      className="flex flex-col items-center justify-center gap-3 shadow-lg"
                      key={index}
                    >
                      <div className="h-35 w-35 relative object-contain p-3 transition-all md:h-56 md:w-56">
                        <Image
                          priority
                          alt="Product Image"
                          src={value?.image || noImg}
                          fill
                        />{" "}
                      </div>
                      <div className="flex w-full flex-col items-start justify-center p-2">
                        <strong>
                          <h1 className="text-md text-sky-600 ">
                            {value?.productName}
                          </h1>
                          <h1 className="ml-1 text-xs">{value?.category}</h1>
                          <h1 className="ml-1 text-xs">
                            &#8369; {value?.price}
                          </h1>
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}
