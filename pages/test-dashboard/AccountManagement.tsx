import ReusableInput from "@/components/Parts/ReusableInput";
import DashboardLayout from "@/components/dashboardLayout";
import Layout from "@/components/layout";
import React, { ReactElement, useState } from "react";

export default function AccountManagement() {
  const [test, setTest] = useState<string>("");
  return (
    <div className="">
      AccountManagement
      <ReusableInput
        name="test"
        value={test}
        onChange={function (value: any): void {
          setTest(value);
        }}
      />
    </div>
  );
}

AccountManagement.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
