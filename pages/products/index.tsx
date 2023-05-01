import React, { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "@/components/layout";
import Product from "@/components/Product";
import Loading from "@/components/Parts/Loading";

interface DATA {
  productName: string;
  expirationDate: string;
  quantity: number;
  id: string;
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
        // setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredData = data
    .filter(({ productName }) => {
      return (
        productName.charAt(0).toLocaleLowerCase() ===
        searchInput.charAt(0).toLocaleLowerCase()
      );
    })
    .filter(({ productName }) => {
      return productName
        .toLocaleLowerCase()
        .includes(searchInput.toLocaleLowerCase());
    });

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Layout>
        <section className="h-full w-full font-bold overflow-hidden overflow-y-auto scrollbar-none border-slate-900 ">
          <div className="relative w-fit">
            <input
              className="absolute px-4 py-3 ring-1 rounded-md focus:ring-slate-950 outline-none ring-slate-200 m-3"
              type="search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              name=""
              id=""
              placeholder="search product name..."
            />
          </div>
          <div className="flex justify-center items-center w-full h-full m-4">
            {isLoading ? (
              <div className=" px-3 py-1 h-screen text-lg font-medium leading-none text-center rounded-full animate-pulse text-black flex items-center">
                <Loading />
              </div>
            ) : (
              <div className="grid grid-cols-4 grid-flow-row p-3 gap-6">
                {!searchInput
                  ? data.map((product) => {
                      return <Product key={product.id} product={product} />;
                    })
                  : filteredData.map((product) => {
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
