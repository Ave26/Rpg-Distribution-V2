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
  SUPERADMIN: baseRoutes,
  ADMIN: baseRoutes, // Admin
  STAFF: [
    { path: "/dashboard/barcode-scanner", label: "Scan Barcode" },
    { path: "/dashboard/add-product", label: "Add Product" },
    { path: "/dashboard/picking-and-packing", label: "Picking And Packing" },
  ],
  DRIVER: [
    { path: "/dashboard/delivery-management", label: "Manage Delivery" },
  ],
};
