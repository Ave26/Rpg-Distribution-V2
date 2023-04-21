import React from "react";
import { findProduct } from "../../lib/prisma/product.ts";
import Image from "next/image";
import banana from "../../public/banana.jpeg";
import Head from "next/head";

// icons
// import { HiMenu } from "react-icons";
import { BeakerIcon } from "react-icons";

export default function Products({ products }) {
  return (
    <>
      <Head>
        <title>Products</title>
      </Head>

      <div className="h-screen w-full flex justify-start items-center">
        <aside className="border h-screen">
          <input
            placeholder="search products"
            className="border border-black p-2 m-3 rounded-3xl"
          />
        </aside>
        <section className="grid grid-cols-4 grid-flow-row gap-4 border h-full w-full">
          {products.map((product) => {
            return (
              <div className="border p-2 bg-emerald-500" key={product.id}>
                <h1>{product.name}</h1>
                <Image src={banana} alt="banana" />
                <h1>{product.description}</h1>
                <h1>{product.price}</h1>
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const { products, error } = await findProduct();

  return {
    props: {
      products: products || error,
    },
  };
}
