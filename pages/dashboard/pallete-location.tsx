import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import ReusableButton from "@/components/Parts/ReusableButton";
import ReusableInput from "@/components/Parts/ReusableInput";
import Toast from "@/components/Parts/Toast";

export default function PalleteLocation() {
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

  const setLevel = (index: number) => {
    switch (index) {
      case 0:
        console.log("High");
        break;
      case 1:
        console.log("High");
        break;
      case 2:
        console.log("Medium");
        break;
      case 3:
        console.log("Medium");
        break;
      case 4:
        console.log("Low");
        break;
      case 5:
        console.log("Low");
        break;

      default:
        console.log("exceeded into the heighest realm");
        break;
    }
  };

  return (
    <Layout>
      <section className="h-full w-full font-bold">
        {/* <div className="h-96 overflow-y-scroll">
          {array.map((value, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-center border">
                {value.map((v, i) => {
                  return (
                    <button
                      onClick={(e) => {
                        console.log(index);
                        setLevel(index);
                      }}
                      key={i}
                      className="border border-black p-10 hover:bg-sky-400">
                      {i} - {v}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div> */}

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
