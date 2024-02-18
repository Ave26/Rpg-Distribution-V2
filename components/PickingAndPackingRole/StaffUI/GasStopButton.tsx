import { buttonStyle } from "@/styles/style";
import React from "react";

export default function GasStopButton() {
  return (
    <button className={buttonStyle} onClick={(e) => e.stopPropagation()}>
      Gas Stop
    </button>
  );
}
