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
        router.push("/");
      })
      .catch((error) => error);
  }
  /*   className={`flex  w-full items-center justify-center rounded-md p-2 text-[10px] font-black uppercase hover:border hover:border-cyan-400`} */
  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`flex items-center justify-center p-2 text-center font-black
        uppercase hover:bg-gradient-to-r hover:from-[#D9C611] hover:via-[#F0DC05] hover:to-[#D9C611] hover:text-white`}
    >
      Logout
    </button>
  );
}
