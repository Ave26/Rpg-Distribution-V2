import React, { useEffect, useState } from "react";
import { TSelectedBTN } from "./deliveryManagementTypes";
import { buttonStyle, buttonStyleEdge } from "@/styles/style";
import { UserRole } from "@prisma/client";

type TDMSProps = {
  states: TStates;
  role: string | undefined;
};

type TStates = {
  selectedButton: TSelectedBTN;
  setSelectedButton: React.Dispatch<React.SetStateAction<TSelectedBTN>>;
};

type TRole = "Driver" | "Admin" | "Super Admin";

export default function DeliveryManagementButtonSelection({
  states,
  role,
}: TDMSProps) {
  const { selectedButton, setSelectedButton } = states;
  const buttonSelections: Record<TRole, TSelectedBTN[] | void> = {
    Driver: ["View Truck Loads"],
    Admin: ["Truck Management", "View Truck Loads", "Manage Location"],
    "Super Admin": ["Truck Management", "View Truck Loads", "Manage Location"],
  };

  const buttonsToRender = buttonSelections[role as TRole] || [];

  return (
    <div className="flex w-full items-center justify-center gap-2 p-2 text-xs font-bold md:w-fit">
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
    </div>
  );
}
