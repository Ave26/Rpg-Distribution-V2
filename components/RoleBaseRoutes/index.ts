import { TEndPoints, TRole } from "@/types/roleTypes";

const baseRoutes = [
  { path: "/dashboard/log-overview", label: "Log Overview" },
  { path: "/dashboard/add-product", label: "Add Product" },
  { path: "/dashboard/barcode-scanner", label: "Scan Barcode" },
  { path: "/dashboard/pallete-location", label: "Pallete Location" },
  { path: "/dashboard/picking-and-packing", label: "Picking And Packing" },
  { path: "/dashboard/delivery-management", label: "Manage Delivery" },
  { path: "/dashboard/inventory-management", label: "Manage Inventory" },
  { path: "/dashboard/acc-management", label: "Manage Account" },
];

export const roleToRoutes: Record<TRole, TEndPoints[]> = {
  SuperAdmin: baseRoutes,
  Admin: baseRoutes,
  Staff: [
    { path: "/dashboard/barcode-scanner", label: "Scan Barcode" },
    { path: "/dashboard/add-product", label: "Add Product" },
    { path: "/dashboard/picking-and-packing", label: "Picking And Packing" },
  ],
  Driver: [
    { path: "/dashboard/delivery-management", label: "Manage Delivery" },
  ],
};
