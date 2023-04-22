import React, { useState } from "react";
import Layout from "../layout";

export default function AdminDashboard() {
  const [dashBoardList, setIsDashBoardList] = useState<string[]>([
    "Add Products",
    "Inventory Management",
    "Pallette Location",
    "Transaction Records",
    "Picking and Packing",
    "Account Management",
  ]);
  return (
    <section>
      {dashBoardList.map((list, index) => {
        return <div key={index}>{list}</div>;
      })}
    </section>
  );
}
