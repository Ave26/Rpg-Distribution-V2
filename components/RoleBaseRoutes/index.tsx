import { TEndPoints, TRole } from "@/types/roleTypes";
import { AiOutlineLoading } from "react-icons/ai";
import { FaCartFlatbed, FaPallet } from "react-icons/fa6";
import {
  MdAccountCircle,
  MdAdminPanelSettings,
  MdPallet,
} from "react-icons/md";
import { ImBoxAdd } from "react-icons/im";
import { BsUpcScan } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import { RiAccountCircleLine } from "react-icons/ri";

const baseRoutes = [
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
    Icon: FaPallet,
  },
  {
    path: "/dashboard/picking-and-packing",
    label: "Picking And Packing",
    Icon: FaCartFlatbed,
  },
  {
    path: "/dashboard/delivery-management",
    label: "Manage Delivery",
    Icon: TbTruckDelivery,
  },
  {
    path: "/dashboard/inventory-management",
    label: "Manage Inventory",
    Icon: ImBoxAdd,
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
      Icon: AiOutlineLoading,
    },
    {
      path: "/dashboard/add-product",
      label: "Add Product",
      Icon: AiOutlineLoading,
    },
    {
      path: "/dashboard/picking-and-packing",
      label: "Picking And Packing",
      Icon: AiOutlineLoading,
    },
  ],
  DRIVER: [
    {
      path: "/dashboard/delivery-management",
      label: "Manage Delivery",
      Icon: AiOutlineLoading,
    },
  ],
};
