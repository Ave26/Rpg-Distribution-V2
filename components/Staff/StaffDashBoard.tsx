import React, { useState } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const router = useRouter();
  const [dashBoardList, setIsDashBoardList] = useState<string[]>([
    "Add Products",
    "Inventory Management",
    "Pallette Location",
    // "Transaction Records",
    "Picking and Packing",
    // "Account Management",
  ]);

  const navigateTo = (list: string) => {
    switch (list) {
      case "Add Products":
        router.push("/dashboard/add-products");
        break;
      case "Inventory Management":
        router.push("/dashboard/inventory-management");
        break;
      case "Pallette Location":
        router.push("/dashboard/pallete-location");
        break;
      // case "Transaction Records":
      //   router.push("/dashboard/transaction-records");
      //   break;
      case "Picking and Packing":
        router.push("/dashboard/picking-and-packing");
        break;
      // case "Account Management":
      //   router.push("/dashboard/acc-management");
      //   break;

      default:
        break;
    }
  };

  return (
    <section className="w-full h-screen flex justify-center items-center gap-2 select-none bg-gradient-to-b from-white via-[#5680E9] to-blue-500">
      {dashBoardList.map((list, index) => {
        return (
          <div
            className="flex justify-center items-center w-40 h-40 p-10 text-center rounded-md shadow-md hover:shadow-xl bg-white"
            onClick={(e) => {
              navigateTo(list);
            }}
            key={index}
          >
            {list}
          </div>
        );
      })}
    </section>
  );
}
