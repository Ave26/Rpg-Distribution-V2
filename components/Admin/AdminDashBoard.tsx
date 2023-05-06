import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

// assets
import addProducts from "../../public/assets/dashBoardImg/AddProducts.png";
import accountMgmt from "../../public/assets/dashBoardImg/AccountManagement.png";
import inventoryMgmt from "../../public/assets/dashboardImg/InventoryManagement.png";
import palletteLoc from "../../public/assets/dashboardImg/PalletLocation.png";
import pickAndPack from "../../public/assets/dashboardImg/PickingandPacking.png";
import transactionRec from "../../public/assets/dashboardImg/TransactionManagement.png";

export default function AdminDashboard() {
  // const [isHovered, setIsHovered] = useState<boolean>(false);

  const router = useRouter();
  const [dashBoardList, setIsDashBoardList] = useState<string[]>([
    "Add Products",
    "Inventory Management",
    "Pallette Location",
    "Transaction Records",
    "Picking and Packing",
    "Account Management",
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
      case "Transaction Records":
        router.push("/dashboard/transaction-records");
        break;
      case "Picking and Packing":
        router.push("/dashboard/picking-and-packing");
        break;
      case "Account Management":
        router.push("/dashboard/acc-management");
        break;

      default:
        router.push("/");
        break;
    }
  };

  const getDashboardImg = (list: string): any => {
    switch (list) {
      case "Add Products":
        return {
          src: addProducts,
          className: "w-full h-full p-4",
        };
      case "Inventory Management":
        return {
          src: inventoryMgmt,
          className: "w-full h-full p-4",
        };
      case "Pallette Location":
        return {
          src: palletteLoc,
          className: "w-full h-full p-4",
        };
      case "Transaction Records":
        return {
          src: transactionRec,
          className: "w-full h-full p-4",
        };
      case "Picking and Packing":
        return {
          src: pickAndPack,
          className: "w-full h-full p-4",
        };
      case "Account Management":
        return {
          src: accountMgmt,
          className: "w-full h-full p-4",
        };
      default:
        return undefined;
    }
  };

  return (
    <section className="w-full h-screen flex justify-center items-center gap-2 select-none bg-gradient-to-b from-white via-[#5680E9] to-blue-500">
      {dashBoardList.map((list, index) => {
        return (
          <div
            className="p-7 relative select-none flex justify-center gap-1 flex-col items-center w-40 h-40 text-center rounded-md shadow-md hover:shadow-xl bg-white"
            onClick={(e) => {
              navigateTo(list);
            }}
            key={index}
            // onMouseEnter={() => {
            //   setIsHovered((hovered) => !hovered);
            // }}
            // onMouseLeave={() => {
            //   setIsHovered((hovered) => !hovered);
            // }}
          >
            <Image {...getDashboardImg(list)} alt={list} />
            <p className="text-xs">{list}</p>
          </div>
        );
      })}
    </section>
  );
}
