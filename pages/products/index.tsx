import React, { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout";
import Loading from "@/components/Parts/Loading";
import Image from "next/image";

interface DATA {
  barcodeId?: string;
  category?: string;
  image?: any;
  price?: number;
  productName?: string;
}

export default function Products() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<DATA[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

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
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // const filteredData = data
  //   .filter(({ productName }) => {
  //     return (
  //       productName.charAt(0).toLocaleLowerCase() ===
  //       searchInput.charAt(0).toLocaleLowerCase()
  //     );
  //   })
  //   .filter(({ productName }) => {
  //     return productName
  //       .toLocaleLowerCase()
  //       .includes(searchInput.toLocaleLowerCase());
  //   });

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Layout>
        <section className="h-full w-full font-bold">
          {/* <div className="relative w-fit">
            <input
              className="absolute m-3 rounded-md px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-slate-950"
              type="search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              name=""
              id=""
              placeholder="search product name..."
            />
          </div> */}
          <div className="flex h-full w-full items-center justify-center">
            {isLoading ? (
              <div className="flex h-screen animate-pulse items-center rounded-full px-3 py-1 text-center text-lg font-medium leading-none text-black">
                <Loading />
              </div>
            ) : (
              <div className="flex flex-col flex-wrap items-center justify-center gap-2 p-5 transition-all md:flex-row">
                {data.map((value, index) => {
                  return (
                    <div
                      className="flex flex-col items-center justify-center gap-3 shadow-lg"
                      key={index}>
                      <Image
                        priority
                        alt="Product Image"
                        src={value?.image}
                        className="h-96 w-96 object-contain p-3 transition-all md:h-56 md:w-56"
                        width="0"
                        height="0"
                      />
                      <div className="flex w-full flex-col items-start justify-center p-2">
                        <strong>
                          <h1 className="text-xs">{value?.productName}</h1>
                          <h1 className="text-xs">{value?.category}</h1>
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
