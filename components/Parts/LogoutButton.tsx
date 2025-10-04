import { useMyContext } from "@/contexts/AuthenticationContext";
import { LogoutResponse } from "@/pages/api/user/logout";
import { buttonStyleDark } from "@/styles/style";
import router from "next/router";
import React from "react";

interface LogoutButton {
  states: {
    logoutResponse: LogoutResponse;
    setLogoutResponse: React.Dispatch<React.SetStateAction<LogoutResponse>>;
  };
}

export default function LogoutButton({ states }: LogoutButton) {
  const { updateGlobalState } = useMyContext();
  const { logoutResponse, setLogoutResponse } = states;
  function handleLogout() {
    fetch("/api/user/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: LogoutResponse) => {
        const { isLogout, message } = data;
        console.log(data);
        setLogoutResponse({
          isLogout,
          message,
        });
        updateGlobalState({
          authenticated: false,
        });
        router.replace("/login");
      })
      .catch((error) => error);
  }
  /*   className={`flex  w-full items-center justify-center rounded-md p-2 text-[10px] font-black uppercase hover:border hover:border-cyan-400`} */
  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`h-8 w-20 items-center justify-center rounded-md bg-gradient-to-b from-yellow-400 via-orange-400 to-orange-600 px-[1.5px]`}
    >
      <h1 className="flex h-full w-full items-center justify-center rounded-lg bg-white font-semibold">
        Logout
      </h1>
    </button>
  );
}
