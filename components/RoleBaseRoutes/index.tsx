import { TEndPoints, TRole } from "@/types/roleTypes";
import { FaCartFlatbed, FaPallet } from "react-icons/fa6";
import { MdAdminPanelSettings, MdOutlineInventory } from "react-icons/md";
import { ImBoxAdd } from "react-icons/im";
import { BsUpcScan } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import { RiAccountCircleLine } from "react-icons/ri";

const baseRoutes: TEndPoints[] = [
  {
    path: "/dashboard/log-overview",
    label: "Log Overview",

    Icon: MdAdminPanelSettings,
  },
  {
    path: "/dashboard/add-product",
    label: "Add Product",
    Icon: ImBoxAdd,
  },
  {
    path: "/dashboard/barcode-scanner",
    label: "Scan Barcode",
    Icon: BsUpcScan,
  },
  {
    path: "/dashboard/pallete-location",
    label: "Pallete Location",
    subMenu: ["Bin", "Damage Bin"],
    Icon: FaPallet,
  },
  {
    path: "/dashboard/inventory-management",
    label: "Manage Inventory",
    subMenu: ["Bin", "Product", "Damage Bin"],
    Icon: MdOutlineInventory,
  },
  {
    path: "/dashboard/picking-and-packing",
    label: "Picking And Packing",
    Icon: FaCartFlatbed,
  },

  {
    path: "/dashboard/delivery-management",
    label: "Manage Delivery",
    subMenu: ["Truck Management", "View Truck Loads", "Manage Location"],
    Icon: TbTruckDelivery,
  },
  {
    path: "/dashboard/acc-management",
    label: "Manage Account",
    Icon: RiAccountCircleLine,
  },
];

export const roleToRoutes: Record<TRole, TEndPoints[]> = {
  SUPERADMIN: baseRoutes,
  ADMIN: baseRoutes, // Admin
  STAFF: [
    {
      path: "/dashboard/barcode-scanner",
      label: "Scan Barcode",
      Icon: BsUpcScan,
    },
    {
      path: "/dashboard/add-product",
      label: "Add Product",
      Icon: ImBoxAdd,
    },
    {
      path: "/dashboard/picking-and-packing",
      label: "Picking And Packing",
      Icon: FaCartFlatbed,
    },
  ],
  DRIVER: [
    {
      path: "/dashboard/delivery-management",
      label: "Manage Delivery",
      // subMenu: ["Truck Management", "View Truck Loads", "Manage Location"],
      Icon: TbTruckDelivery,
    },
  ],
};
