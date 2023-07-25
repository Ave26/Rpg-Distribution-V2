import ReusableLink from "../Parts/ReusableLink";
import ReusableDropDownMenu from "../Parts/ReusableDropDownMenu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center md:flex-nowrap md:items-start md:justify-start">
      <aside className="relative flex h-full w-full flex-row items-center gap-2 overflow-hidden overflow-x-auto border p-2 text-xs md:h-screen md:w-fit md:flex-col md:items-center md:gap-3 md:overflow-y-auto md:overflow-x-hidden md:p-6 md:dark:bg-slate-200">
        <ReusableDropDownMenu
          initialName={"Manage Products"}
          numberOfChildren={2}
          childNamePrefix={[
            {
              endPoint: "barcode-scanner",
              name: "Scan Barcode",
            },
            {
              endPoint: "add-new-product",
              name: "Add New Product",
            },
          ]}
        />
        <ReusableLink
          endPoint={"acc-management"}
          linkName={"Account Management"}
        />

        <ReusableLink
          visibility="not-sr-only md:sr-only"
          endPoint={"barcode-scanner"}
          linkName={"Scan Barcode"}
        />
        <ReusableLink
          visibility="not-sr-only md:sr-only"
          endPoint={"add-new-product"}
          linkName={"Add New Product"}
        />
      </aside>

      <main className="flex h-full w-full items-center justify-center">
        {children}
      </main>
    </div>
  );
}
