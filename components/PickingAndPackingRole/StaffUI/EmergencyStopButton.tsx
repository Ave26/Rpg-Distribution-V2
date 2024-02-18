import { buttonStyle } from "@/styles/style";
import React from "react";

export default function EmergencyStopButton() {
  const isEmergencyStop = true;

  return (
    <button className={buttonStyle} onClick={(e) => e.stopPropagation()}>
      Emergency Stop
    </button>
  );
}
