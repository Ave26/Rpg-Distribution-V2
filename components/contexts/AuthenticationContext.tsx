import React, { createContext, useContext, useState, ReactNode } from "react";

interface MyContextType {
  globalState: any;
  updateGlobalState: (newValue: string) => void;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [globalState, setGlobalState] = useState<string>("initialState");

  const updateGlobalState = (newValue: string) => {
    setGlobalState(newValue);
  };
  console.log("GlobalState:", globalState);
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
