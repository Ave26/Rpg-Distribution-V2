import React, { ReactElement, useState, useEffect } from "react";
import useSWR from "swr";
import jsPDF from "jspdf";
import Head from "next/head";
import Layout from "@/components/layout";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import BinsLayout from "@/components/BinsLayout";
import Loading from "@/components/Parts/Loading";
import Search from "@/components/Parts/Search";
import ReusableButton from "@/components/Parts/ReusableButton";

import { EntriesTypes } from "@/types/binEntries";
import { Bin } from "@/types/inventory";
import { TFormData } from "@/types/inputTypes";
import { Orders } from "@/types/ordersTypes";
import { getTrucks } from "@/lib/prisma/trucks";
import { useMyContext } from "@/contexts/AuthenticationContext";

import { trucks as TTrucks, UserRole } from "@prisma/client";
import AdminUI from "@/components/PickingAndPackingRole/AdminUI";
import StaffUI from "@/components/PickingAndPackingRole/StaffUI";

type TRole = "SuperAdmin" | "Admin" | "Staff";
type TRoleToComponents = {
  SuperAdmin: () => JSX.Element;
  Admin: () => JSX.Element;
  Staff: () => JSX.Element;
};

export default function PickingAndPacking({ trucks }: { trucks: TTrucks[] }) {
  const { globalState } = useMyContext();
  const role = globalState?.verifiedToken?.roles;
  const roleToComponents: TRoleToComponents = {
    SuperAdmin: () => <AdminUI trucks={trucks} />,
    Admin: () => <AdminUI trucks={trucks} />,
    Staff: () => <StaffUI />,
  };

  return (
    <>
      <Head>
        <title>{"Dashboard | Picking And Packing"}</title>
      </Head>

      <div>
        {roleToComponents[role as TRole]
          ? roleToComponents[role as TRole]()
          : null}
      </div>

      {/* <div className="flex h-full w-full flex-col gap-2 overflow-y-auto p-2 md:h-screen  md:flex-row md:justify-center md:p-4">
        <div className="flex h-full w-full flex-col gap-2 md:h-fit md:max-w-fit md:justify-start">
          <Search
            formData={formData}
            handleChange={handleChange}
            handleSearch={() => mutate()}
            personaleEffects={{ placeholder: "Search Barcode", maxLength: 14 }}
          />

          <input
            min={0}
            type="number"
            name="quantity"
            placeholder="Quantity"
            onChange={handleChange}
            value={formData.quantity}
            className={inputStyle}
          />

          <input
            type="text"
            name="clientName"
            placeholder="Client Name"
            onChange={handleChange}
            value={formData.clientName}
            className={inputStyle}
          />

          <select
            name="truck"
            value={formData.truck}
            onChange={handleChange}
            className={inputStyle}>
            {trucks?.map((truck) => {
              return <option key={truck?.id}>{truck.name}</option>;
            })}
          </select>

          <input
            type="text"
            name="destination"
            placeholder="Destination"
            onChange={handleChange}
            value={formData.destination}
            className={inputStyle}
          />

          <ReusableButton
            name={"Clear Selected Bins"}
            className="flex items-center justify-center rounded-lg border border-black bg-transparent p-2 text-center text-base font-medium text-black hover:shadow-lg dark:bg-transparent dark:active:bg-pink-700"
            onClick={() => {
              setProductEntry([]);
            }}
          />
        </div>
        {isLoading ? (
          <div className="flex h-full w-full max-w-3xl items-center justify-center border md:max-h-96">
            <Loading />
          </div>
        ) : (
          <div className="relative flex w-full flex-col items-center justify-center gap-2 transition-all">
            <BinsLayout
              isLoading={isLoading}
              bins={bins}
              dataEntries={{ productEntry, setProductEntry }}
              formData={formData}
              setFormData={setFormData}
            />
            <div className="border-slate relative h-[17em] w-full overflow-y-auto border border-black p-2 md:w-[45em]">
              {productEntry?.map((entry, index) => (
                <span
                  key={entry.barcodeId}
                  className={`relative my-2 flex h-1/4 w-full animate-emerge items-center justify-center gap-2 text-white`}>
                  <div className="flex h-full w-full flex-row items-center justify-between rounded-lg border border-slate-100/50 p-2 text-center">
                    <div className="flex flex-col items-start">
                      <h1>
                        <strong>{entry.productName}</strong>
                      </h1>

                      <p>
                        Covered Bin Count: {Number(entry.binIdsEntries.length)}
                      </p>
                    </div>

                    <div className="flex rounded-lg border bg-slate-100/30 px-4 py-2 text-white">
                      {entry.totalQuantity}
                    </div>
                  </div>
                  <button
                    className="h-full w-1/12 rounded-lg border border-slate-100/50"
                    onClick={() => {
                      const updatedProductEntry = [...productEntry];
                      updatedProductEntry.splice(index, 1);
                      setProductEntry(updatedProductEntry);
                      setIsAnimate(true);
                    }}>
                    x
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <ReusableButton
                type={"submit"}
                isLoading={hasLoading}
                name={"Confirm and Print report"}
                onClick={makeReport}
                className="flex items-center justify-center rounded-lg bg-blue-700 p-2 text-center text-base font-medium text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800"
              />
            </div>
          </div>
        )}
      </div> */}
    </>
  );
}

export async function getServerSideProps() {
  const { trucks } = await getTrucks();

  return {
    props: { trucks },
  };
}

PickingAndPacking.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
