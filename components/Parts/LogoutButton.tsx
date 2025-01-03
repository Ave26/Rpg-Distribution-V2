import { buttonStyleDark } from "@/styles/style";
import router from "next/router";
import React from "react";

export default function LogoutButton() {
  function handleLogout() {
    fetch("/api/user/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ message }) => {
        console.log(message);
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
