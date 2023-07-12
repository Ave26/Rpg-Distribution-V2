import Header from "./Header";
import Footer from "./Footer";
import Link from "next/link";
import { useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="">
      <nav className="flex w-full items-center justify-center overflow-x-auto">
        <Link
          href={"/test-dashboard/AccountManagement"}
          className="w-fit hover:text-sky-500">
          Account Management
        </Link>
        <Link
          href={"/test-dashboard/AddProduct"}
          className="w-fit hover:text-sky-500 ">
          Add Product
        </Link>
      </nav>

      <main className="">{children}</main>
    </div>
  );
}
