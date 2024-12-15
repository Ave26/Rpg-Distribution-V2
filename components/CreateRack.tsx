import React, { useEffect, useState } from "react";
import ReusableInput from "./Parts/ReusableInput";
import ReusableButton from "./Parts/ReusableButton";
import Toast from "./Parts/Toast";

function CreateRack() {
  const [rackCategory, setRackCategory] = useState<String>("");
  const [rackName, setRackName] = useState<String>("");
  const [numberOfBins, setNumberOfBins] = useState<number>(0);
  const [shelfLevel, setShelfLevel] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>("");
  const [isShow, setIsShow] = useState<boolean>(false);

  // Food
  // Laundry
  // Cosmetics
  // Sanitary
  // Cleaning

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
          rackCategory,
          rackName,
          numberOfBins,
          shelfLevel,
        }),
      });
      const json = await response.json();
      // console.log(json);
      setData(json?.message);
      setIsLoading(false);
      setIsShow(true);
    } catch (error) {
      console.log(error);

      setIsLoading(false);
    } finally {
      setRackName("");
      setNumberOfBins(0);
      setShelfLevel(0);
    }
  };

  return (
    <form
      onSubmit={handleCreateRack}
      className="flex flex-col flex-wrap items-center justify-center gap-2 p-3"
    >
      <ReusableInput
        disableLabel={true}
        name="Rack Category"
        value={rackCategory}
        onChange={function (value: any): void {
          setRackCategory(value);
        }}
      />
      <h1></h1>
      <ReusableInput
        disableLabel={true}
        name="Rack Name"
        value={rackName}
        onChange={function (value: any): void {
          setRackName(value);
        }}
      />
      <ReusableInput
        min={0}
        disableLabel={true}
        name="Number of Bins"
        value={numberOfBins}
        type="number"
        onChange={(value: number) => {
          setNumberOfBins(value);
        }}
      />
      <ReusableInput
        min={0}
        disableLabel={true}
        name="Shelf Level"
        value={shelfLevel}
        type="number"
        onChange={(value: number) => {
          setShelfLevel(value);
        }}
      />
      <ReusableButton type="submit" name="Save" isLoading={isLoading} />
      <Toast isShow={isShow} data={data} />
    </form>
  );
}

export default CreateRack;
