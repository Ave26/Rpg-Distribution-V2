import React from "react";
import Layout from "@/components/layout";
import { useRouter } from "next/router";

import { HiArrowNarrowLeft } from "react-icons/hi";

export default function AddProducts() {
  const router = useRouter();
  const backToStaffPage = async () => {
    router.push("/");
  };

  return (
    <Layout>
      <section className="h-screen w-full">
        <HiArrowNarrowLeft className="w-9 h-9 m-6" onClick={backToStaffPage} />
      </section>
    </Layout>
  );
}
