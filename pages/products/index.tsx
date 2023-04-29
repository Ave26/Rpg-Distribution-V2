import React, { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout";
import Product from "@/components/Product";

interface DATA {
  productName: string;
  expirationDate: string;
  quantity: number;
  id: string;
}

export default function Products() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<DATA[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/public-products")
      .then(async (response) => {
        if (response.status === 200) {
          const json = await response.json();
          setData(json);
        }
      })
      .catch((error) => {
        console.log(error);
        // setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Layout>
        <section className="h-full w-full font-bold overflow-hidden overflow-y-auto scrollbar-none border border-slate-900">
          <div className="flex justify-center items-center w-full h-full m-4">
            {isLoading ? (
              <div className="px-3 py-1 text-lg font-medium leading-none text-centerrounded-full animate-pulse text-black">
                loading...
              </div>
            ) : (
              <div className="grid grid-cols-4 grid-flow-row p-3 gap-6">
                <div className="w-fit">
                  <input
                    className="px-4 py-3 ring-2 rounded-md focus:ring-slate-950 outline-none ring-slate-200"
                    type="search"
                    name=""
                    id=""
                    placeholder="search products"
                  />
                </div>
                {data.map((product) => {
                  return <Product key={product.id} product={product} />;
                })}
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}
