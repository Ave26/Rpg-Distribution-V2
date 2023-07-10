import React, { ReactElement, useEffect, useState } from "react";
import Layout from "@/components/layout";
import ReusableButton from "@/components/Parts/ReusableButton";
import ReusableInput from "@/components/Parts/ReusableInput";
import Toast from "@/components/Parts/Toast";
import { NextApiRequest, NextPage } from "next";
import { verifyJwt } from "@/lib/helper/jwt";
import Header from "@/components/Header";

export default function PalleteLocation({ data: dta }: any) {
  const [category, setCategory] = useState<String>("");
  const [rack, setRack] = useState<String>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [data, setData] = useState<any>("");

  const handleCreateRack = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/racks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          rack,
        }),
      });
      const json = await response.json();
      console.log(json);
      setData(json?.message);
      setIsLoading(false);
      setIsShow(true);
    } catch (error) {
      console.log(error);

      setIsLoading(false);
    } finally {
      setRack("");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isShow]);

  return (
    <Layout data={dta}>
      <section className="h-full w-full font-bold">
        <form onSubmit={handleCreateRack} className="">
          <ReusableInput
            name="Set Category"
            value={category}
            onChange={function (value: any): void {
              setCategory(value);
            }}
          />
          <ReusableInput
            name="Set Rack"
            value={rack}
            onChange={function (value: any): void {
              setRack(value);
            }}
          />
          <ReusableButton
            type="click"
            name="Create Rack"
            isLoading={isLoading}
          />
        </form>
        <Toast isShow={isShow} data={data} />
      </section>
    </Layout>
  );
}
