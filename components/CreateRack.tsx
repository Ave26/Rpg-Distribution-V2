import React, { useEffect, useState } from "react";
import ReusableInput from "./Parts/ReusableInput";
import ReusableButton from "./Parts/ReusableButton";

function CreateRack() {
  const [category, setCategory] = useState<String>("");
  const [rack, setRack] = useState<String>("");
  const [capacity, setCapacity] = useState<number>(0);
  const [rackLevel, setRackLevel] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>("");
  const [isShow, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isShow]);

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

  return (
    <form
      onSubmit={handleCreateRack}
      className="flex flex-col flex-wrap items-center justify-center gap-2 p-3">
      <ReusableInput
        name="Rack Category"
        value={category}
        onChange={function (value: any): void {
          setCategory(value);
        }}
      />
      <h1></h1>
      <ReusableInput
        name="Name"
        value={rack}
        onChange={function (value: any): void {
          setRack(value);
        }}
      />
      <ReusableInput
        name="Capacity"
        value={capacity}
        type="number"
        onChange={(value: number) => {
          setCapacity(value);
        }}
      />
      <ReusableInput
        name="Level"
        value={rackLevel}
        type="number"
        onChange={(value: number) => {
          setRackLevel(value);
        }}
      />
      <ReusableButton type="click" name="Save" isLoading={isLoading} />
      {/* <Toast isShow={isShow} data={data} /> */}
    </form>
  );
}

export default CreateRack;
