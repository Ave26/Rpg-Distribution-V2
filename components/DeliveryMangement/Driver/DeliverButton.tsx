import React from "react";

export default function DeliverButton() {
  const buttonStyle =
    "rounded-sm bg-sky-300/40 w-full flex justify-center items-center text-center h-10 p-2 shadow-md text-[8px] hover:bg-sky-300/10 active:bg-sky-300 uppercase  font-black";

  function changeProductStatus() {
    console.log("changing product status");
  }

  return (
    <button className={buttonStyle} onClick={changeProductStatus}>
      Complete Delivery
    </button>
  );
}
