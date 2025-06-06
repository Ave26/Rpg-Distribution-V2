import { TEndPoints, TRole } from "@/types/roleTypes";
import { FaCartFlatbed, FaPallet } from "react-icons/fa6";
import {
  MdAdminPanelSettings,
  MdInventory2,
  MdListAlt,
  MdOutlineBrokenImage,
  MdOutlineInventory,
  MdOutlineListAlt,
} from "react-icons/md";
import { ImBoxAdd } from "react-icons/im";
import { BsFillHddRackFill, BsUpcScan } from "react-icons/bs";
import { TbReport, TbReportMedical, TbTruckDelivery } from "react-icons/tb";
import { RiAccountCircleLine } from "react-icons/ri";
import { AiOutlineProject } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { CgPlayListRemove } from "react-icons/cg";
import { BiCabinet } from "react-icons/bi";

const baseRoutes: TEndPoints[] = [
  {
    path: "/dashboard/log-overview",
    basePath: "/dashboard/log-overview",
    label: "LOG OVERVIEW",
    subMenu: [
      {
        label: "ORDER QUEUE",
        path: "order-queue",
        Icon: TbReport,
      },
      {
        label: "PRODUCT STATUS REPORT",
        path: "product-status",
        Icon: TbReportMedical,
      },
      {
        label: "DOWNLOADABLE REPORT",
        path: "report",
        Icon: MdOutlineListAlt,
      },
      {
        label: "DUPLICATE SCANS",
        path: "duplicate-scans",
        Icon: CgPlayListRemove,
      },
      {
        label: "DELIVERY LOGS",
        path: "delivery-logs",
        Icon: TbTruckDelivery,
      },
    ],
    Icon: MdAdminPanelSettings,
  },
  {
    label: "MANAGE PRODUCT",
    basePath: "/dashboard/manage-product",
    path: "",
    subMenu: [
      {
        label: "ADD PRODUCT",
        path: "add-product",
        Icon: IoMdAdd,
      },
      {
        label: "SCAN PRODUCT",
        path: "scan-product",
        Icon: BsUpcScan,
      },
    ],

    Icon: ImBoxAdd,
  },
  {
    label: "MANAGE RACK",
    basePath: "/dashboard/manage-rack",
    path: "",
    subMenu: [
      {
        label: "BIN",
        path: "bin",
        Icon: BiCabinet,
      },
      {
        label: "DAMAGE BIN",
        path: "damage-bin",
        Icon: MdOutlineBrokenImage,
      },
    ],

    Icon: BsFillHddRackFill,
  },
  {
    label: "PICKING AND PACKING",
    basePath: "/dashboard/picking-and-packing/take-order",
    path: "",
    Icon: FaCartFlatbed,
  },
  {
    label: "MANAGE INVENTORY",
    basePath: "/dashboard/manage-inventory",
    path: "",
    subMenu: [
      {
        label: "BIN",
        path: "bin",
        Icon: BiCabinet,
      },
      {
        label: "DAMAGE BIN",
        path: "damage-bin",
        Icon: MdOutlineBrokenImage,
      },
      {
        label: "PRODUCT",
        path: "product",
        Icon: AiOutlineProject,
      },
    ],

    Icon: MdInventory2,
  },

  // {
  //   path: "/dashboard/add-product",
  //   label: "Add Product",
  //   Icon: ImBoxAdd,
  // },
  // {
  //   path: "/dashboard/barcode-scanner",
  //   label: "Scan Barcode",
  //   Icon: BsUpcScan,
  // },
  // {
  //   path: "/dashboard/pallete-location",
  //   label: "PALLETE LOCATION",
  //   // subMenu: ["Bin", "Damage Bin"],
  //   subMenu: [],
  //   Icon: FaPallet,
  // },
  // {
  //   path: "/dashboard/inventory-management",
  //   label: "MANAGE INVENTORY",
  //   // subMenu: ["Bin", "Product", "Damage Bin"],
  //   subMenu: [],

  //   Icon: MdOutlineInventory,
  // },
  // {
  //   path: "/dashboard/picking-and-packing",
  //   label: "PICKING AND PACKING",
  //   Icon: FaCartFlatbed,
  // },

  {
    path: "/dashboard/delivery-management",
    label: "MANAGE DELIVERY",
    // subMenu: ["Truck Management", "View Truck Loads", "Manage Location"],
    subMenu: [],
    Icon: TbTruckDelivery,
  },
  {
    path: "/dashboard/acc-management",
    label: "MANAGE ACCOUNT",
    Icon: RiAccountCircleLine,
  },
];

export const roleToRoutes: Record<TRole, TEndPoints[]> = {
  SUPERADMIN: baseRoutes,
  ADMIN: baseRoutes, // Admin
  STAFF: [
    {
      label: "MANAGE PRODUCT",
      basePath: "/dashboard/manage-product",
      path: "",
      subMenu: [
        {
          label: "ADD PRODUCT",
          path: "add-product",
          Icon: IoMdAdd,
        },
        {
          label: "SCAN PRODUCT",
          path: "scan-product",
          Icon: BsUpcScan,
        },
      ],

      Icon: ImBoxAdd,
    },
    {
      label: "PICKING AND PACKING",
      basePath: "/dashboard/picking-and-packing/sort-order",
      path: "",
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
