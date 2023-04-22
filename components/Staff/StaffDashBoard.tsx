import React, { useState } from "react";
import Layout from "../layout";
export default function StaffDashBoard() {
  const [dashBoardList, setIsDashBoardList] = useState<string[]>([
    "Add Products",
    "Inventory Management",
    "Pallette Location",
    "Picking and Packing",
  ]);
  return (
    <section>
      {dashBoardList.map((list, index) => {
        return <div key={index}>{list}</div>;
      })}
    </section>
  );
}
