import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import ReusableButton from "@/components/Parts/ReusableButton";
import ReusableInput from "@/components/Parts/ReusableInput";
import Toast from "@/components/Parts/Toast";

export default function PalleteLocation() {
  const [category, setCategory] = useState<String>("");
  const [section, setSection] = useState<String>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [data, setData] = useState<any>("");
  const categories: string[] = [
    "Food",
    "Laundry",
    "Cosmetics",
    "Sanitary",
    "Cleaning",
  ];
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
          section,
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
      setSection("");
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
    <Layout>
      <section className="h-screen w-full font-bold">
        <form onSubmit={handleCreateRack} className="">
          <ReusableInput
            name="Set Category"
            value={category}
            onChange={function (value: any): void {
              setCategory(value);
            }}
          />
          <ReusableInput
            name="Set Section"
            value={section}
            onChange={function (value: any): void {
              setSection(value);
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
