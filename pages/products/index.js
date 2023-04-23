import React, { useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/layout";

// icons
// import { HiMenu } from "react-icons";
import { BeakerIcon } from "react-icons";

export default function Products() {
  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <Layout>
        <div className="h-screen w-full flex justify-start items-center">
          <aside className="border h-screen">
            <input
              placeholder="search products"
              className=" border-black p-2 m-3 rounded-3xl"
            />
          </aside>
          <section className="grid grid-cols-4 grid-flow-row gap-4 border h-full w-full text-black">
            this will be the product
          </section>
        </div>
      </Layout>
    </>
  );
}

// export async function getServerSideProps(context) {
//   const {} = await pr;

//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }
