import Head from "next/head";
import React from "react";

export default function About({ data }: any) {
  return (
    <>
      <Head>
        <title>About</title>
      </Head>
      <section className="w-full h-screen">This is About Page</section>
    </>
  );
}
