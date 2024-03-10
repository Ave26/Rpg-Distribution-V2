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

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        "cursor-pointer select-none rounded-md border border-transparent bg-transparent  p-2 font-bold hover:border-cyan-400 "
      }
    >
      Logout
    </button>
  );
}
