import {
  ButtonState,
  DeliveryState,
} from "@/pages/dashboard/inventory-management";
import { AuthProps } from "@/types/authTypes";
import { TRole } from "@/types/roleTypes";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface MyContextType {
  globalState: AuthProps | undefined | null;
  updateGlobalState: (newValue: AuthProps) => void;
  states?: {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    binAction: "Bin" | "Damage Bin";
    setBinAction: React.Dispatch<React.SetStateAction<"Bin" | "Damage Bin">>;
    inventoryAction: ButtonState;
    setInventoryAction: React.Dispatch<React.SetStateAction<ButtonState>>;
    deliveryAction: DeliveryState;
    setDeliveryAction: React.Dispatch<React.SetStateAction<DeliveryState>>;
    menuAction: {
      label: string;
    };
    setMenuAction: React.Dispatch<
      React.SetStateAction<{
        label: string;
      }>
    >;
  };
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [globalState, setGlobalState] = useState<AuthProps | undefined>(
    undefined
  );
  const updateGlobalState = (newValue: AuthProps) => {
    setGlobalState(newValue);
  };

  const [isActive, setIsActive] = useState(false);
  const [binAction, setBinAction] = useState<"Bin" | "Damage Bin">("Bin");
  const [inventoryAction, setInventoryAction] = useState<ButtonState>("Bin");
  const [deliveryAction, setDeliveryAction] =
    useState<DeliveryState>("Truck Management");

  const [subMenuAction, setSubmenuAction] = useState<{
    label: string;
    menu: string;
  }>({ label: "", menu: "" });

  const [menuAction, setMenuAction] = useState({
    label: "",
  });

  return (
    <MyContext.Provider
      value={{
        globalState,
        updateGlobalState,
        states: {
          menuAction,
          setMenuAction,
          isActive,
          setIsActive,
          binAction,
          setBinAction,
          inventoryAction,
          setInventoryAction,
          deliveryAction,
          setDeliveryAction,
        },
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = (): MyContextType => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
