import React, { useEffect, useState } from "react";
import { TSelectedBTN } from "./deliveryManagementTypes";

type TDMSProps = {
  states: TStates;
};

type TStates = {
  selectedButton: TSelectedBTN;
  setSelectedButton: React.Dispatch<React.SetStateAction<TSelectedBTN>>;
};

export default function DeliveryManagementButtonSelection({
  states,
}: TDMSProps) {
  const { selectedButton, setSelectedButton } = states;
  const btnStyle =
    "select-none p-3 border border-black  rounded-lg rounded-br-none outline-none shadow-lg hover:shadow-xl hover:rounded-tl-none hover:rounded-br-lg duration-200";

  return (
    <div className="flex w-full items-center justify-center gap-2 p-2 text-xs font-bold md:w-fit">
      <button
        className={`${btnStyle} ${
          selectedButton === "Truck Management" && "bg-[#86B6F6]"
        }`}
        onClick={() => setSelectedButton("Truck Management")}>
        Truck Management
      </button>
      <button
        className={`${btnStyle} ${
          selectedButton === "View Truck Loads" && "bg-[#86B6F6]"
        }`}
        onClick={() => setSelectedButton("View Truck Loads")}>
        View Trucks Loads
      </button>
    </div>
  );
}
