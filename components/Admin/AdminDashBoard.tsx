import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

// assets
import addProducts from "../../public/assets/dashboardImg/addProducts.png";
import accountMgmt from "../../public/assets/dashboardImg/accountManagement.png";
import inventoryMgmt from "../../public/assets/dashboardImg/inventoryManagement.png";
import palletteLoc from "../../public/assets/dashboardImg/palletteLocation.png";
import pickAndPack from "../../public/assets/dashboardImg/pickingAndPacking.png";
import transactionRec from "../../public/assets/dashboardImg/transactionRecords.png";

export default function AdminDashboard() {
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
        };
      case "Inventory Management":
        return {
          src: accountMgmt,
        };
      case "Pallette Location":
        return {
          src: palletteLoc,
        };
      case "Transaction Records":
        return {
          src: transactionRec,
        };
      case "Picking and Packing":
        return {
          src: pickAndPack,
        };
      case "Account Management":
        return {
          src: accountMgmt,
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
            className="flex justify-center gap-1 flex-col items-center w-40 h-40 p-10 text-center rounded-md shadow-md hover:shadow-xl bg-white"
            onClick={(e) => {
              navigateTo(list);
            }}
            key={index}
          >
            <Image
              {...getDashboardImg(list)}
              alt={list}
              className="bg-slate-900"
            />
            <p className="text-xs">{list}</p>
          </div>
        );
      })}
    </section>
  );
}
