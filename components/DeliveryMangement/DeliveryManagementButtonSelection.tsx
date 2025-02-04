import React from "react";
import { TSelectedBTN } from "./deliveryManagementTypes";
import { buttonStyleEdge } from "@/styles/style";

type TDMSProps = {
  states: TStates;
  role: string | undefined;
};

type TStates = {
  selectedButton: TSelectedBTN;
  setSelectedButton: React.Dispatch<React.SetStateAction<TSelectedBTN>>;
};

type TRole = "DRIVER" | "ADMIN" | "SUPERADMIN";

export default function DeliveryManagementButtonSelection({
  states,
  role,
}: TDMSProps) {
  const { selectedButton, setSelectedButton } = states;
  const buttonSelections: Record<TRole, TSelectedBTN[] | void> = {
    DRIVER: ["View Truck Loads"],
    ADMIN: ["Truck Management", "View Truck Loads", "Manage Location"],
    SUPERADMIN: ["Truck Management", "View Truck Loads", "Manage Location"],
  };

  const buttonsToRender = buttonSelections[role as TRole] || [];

  return (
    <>
      {buttonsToRender.map((btn, index) => {
        return (
          <button
            className={`${buttonStyleEdge} ${
              selectedButton === btn && "bg-[#86B6F6]"
            }`}
            key={index}
            onClick={() => setSelectedButton(btn)}
          >
            {btn}
          </button>
        );
      })}
    </>
  );
}
