import React, { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout";
import Image from "next/image";

// icons
// import { HiMenu } from "react-icons";
// import { BeakerIcon } from "react-icons";

interface DATA {
  productName: string;
  expirationDate: string;
  quantity: number;
  id: string;
}

export default function Products() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<DATA[]>([]);
  const [error, setError] = useState<any | unknown>([]);
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
        // console.log(error);
        setError(error);
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
        <section className="h-screen w-full font-bold">
          <div className="w-full h-fit border p-2">
            <input
              className="px-5 py-5 ring-2 rounded-md focus:ring-slate-950 outline-none ring-slate-200"
              type="search"
              name=""
              id=""
              placeholder="search products"
            />
          </div>

          <div className="flex justify-center items-center w-full h-full">
            {isLoading ? (
              <div className="px-3 py-1 text-lg font-medium leading-none text-centerrounded-full animate-pulse text-black">
                loading...
              </div>
            ) : (
              <div className=" border-red-700 h-fit w-full flex justify-start items-center p-4 gap-2 flex-wrap">
                {data.map((product) => {
                  return (
                    <div
                      key={product.id}
                      className="text-lg border p-2 w-80 h-56 shadow-md cursor-pointer shadow-blue-200 flex justify-center items-center gap-1 flex-col"
                    >
                      <h1>Product Name: {product.productName}</h1>
                      <h1>Expiration Date: {product.expirationDate}</h1>
                      <h1>Quantity: {product.quantity}</h1>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* <a
            href="#"
            className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Image
              className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
              width='2'
              height='2'
              src={"/#"}
              alt=""
            />
            <div className="flex flex-col justify-between p-4 leading-normal">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Noteworthy technology acquisitions 2021
              </h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                Here are the biggest enterprise technology acquisitions of 2021 so
                far, in reverse chronological order.
              </p>
            </div>
          </a> */}
      </Layout>
    </>
  );
}
