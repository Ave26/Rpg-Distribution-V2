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
        <section className="h-full w-full overflow-hidden overflow-y-auto border-slate-900 font-bold scrollbar-none ">
          <div className="relative w-fit">
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
          </div>
          <div className="m-4 flex h-full w-full items-center justify-center">
            {isLoading ? (
              <div className=" flex h-screen animate-pulse items-center rounded-full px-3 py-1 text-center text-lg font-medium leading-none text-black">
                <Loading />
              </div>
            ) : (
              <div className="grid grid-flow-row grid-cols-4 gap-6 p-3">
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
