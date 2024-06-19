import { AuthProps } from "@/types/authTypes";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface MyContextType {
  globalState: AuthProps | undefined | null;
  updateGlobalState: (newValue: AuthProps) => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [globalState, setGlobalState] = useState<AuthProps | undefined>(
    undefined
  );

  const updateGlobalState = (newValue: AuthProps) => {
    setGlobalState(newValue);
  };

  return (
    <MyContext.Provider value={{ globalState, updateGlobalState }}>
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
