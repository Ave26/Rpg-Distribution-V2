import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
// import Geolocation from "../Geolocation";
// assets
import addProducts from "../../public/assets/dbrdimg/AddProducts.png";
import accountMgmt from "../../public/assets/dbrdimg/AccountManagement.png";
import inventoryMgmt from "../../public/assets/dbrdimg/InventoryManagement.png";
import palletteLoc from "../../public/assets/dbrdimg/PalletLocation.png";
import pickAndPack from "../../public/assets/dbrdimg/PickingandPacking.png";
import transactionRec from "../../public/assets/dbrdimg/TransactionManagement.png";
import deliveryMgmt from "../../public/assets/dbrdimg/delivery-managementIcon.png";

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
    "Delivery Management",
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
      case "Delivery Management":
        router.push("/dashboard/delivery-management");
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

      case "Delivery Management":
        return {
          src: deliveryMgmt,
          className: "w-full h-full p-4",
        };
      default:
        return undefined;
    }
  };

  return (
    <section className="md:p-30 flex h-screen w-full select-none flex-wrap items-center justify-center gap-2 p-5 sm:p-24">
      {dashBoardList.map((list, index) => {
        return (
          <div
            className="flex h-36 w-36 select-none flex-col items-center justify-center gap-1 rounded-md border bg-white  p-7 text-center shadow-md hover:p-5 hover:shadow-xl lg:h-40 lg:w-40"
            onClick={(e) => {
              navigateTo(list);
            }}
            key={index}>
            <Image {...getDashboardImg(list)} alt={list} />
            <p className="text-xs">{list}</p>
          </div>
        );
      })}
    </section>
  );
}
