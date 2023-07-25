import DashboardLayout from "@/components/Admin/dashboardLayout";
import Layout from "@/components/layout";
import React, { ReactElement, useEffect } from "react";
export default function AddProduct() {
  return <div className="">AddProduct</div>;
}

AddProduct.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
