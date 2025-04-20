import { useMyContext } from "@/contexts/AuthenticationContext";
import React from "react";

function HamburgerMenuHeader() {
  const context = useMyContext();
  const Dashboard = context.states;

  return (
    <button
      className="group flex flex-col gap-1"
      onClick={() => {
        Dashboard?.setIsActive(!Dashboard.isActive);
      }}
    >
      <div className="h-[4px] w-8 rounded-l-xl rounded-r-xl bg-slate-700/50 group-hover:bg-slate-700/80 group-active:bg-slate-700"></div>

      <div className="flex w-8 gap-[.5px]">
        <div className="h-[4px] w-[10%] rounded-full bg-slate-700/50 group-hover:bg-slate-700/80 group-active:bg-slate-700"></div>
        <div className="h-[4px] w-[90%] rounded-l-xl rounded-r-xl bg-slate-700/50 group-hover:bg-slate-700/80 group-active:bg-slate-700"></div>
      </div>

      <div className="h-[4px] w-8 rounded-l-xl rounded-r-xl bg-slate-700/50 group-hover:bg-slate-700/80 group-active:bg-slate-700"></div>
    </button>
  );
}

export default HamburgerMenuHeader;
