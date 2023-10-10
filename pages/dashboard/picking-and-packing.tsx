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

import { trucks as TTrucks } from "@prisma/client";

export default function PickingAndPacking({ trucks }: { trucks: TTrucks[] }) {
  const [productEntry, setProductEntry] = useState<EntriesTypes[] | null>([]);
  const [hasLoading, setHasLoading] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const [formData, setFormData] = useState<TFormData>({
    barcodeId: "",
    truck: trucks[0]?.name,
    destination: "",
    clientName: "",
    productName: "",
    quantity: 0,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData({
      ...formData, // Spread the existing state
      [name]: value, // Update the specific field
    });
  }
  const fetcher = async (url: string) => {
    const { barcodeId } = formData;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        searchSomething: barcodeId,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Bin[] = await response.json();
    return data;
  };

  const {
    isLoading,
    data: bins,
    mutate,
  } = useSWR(`/api/bins/search`, fetcher, {
    refreshInterval: 1500,
  });

  useEffect(() => {
    if (productEntry) {
      if (productEntry?.length > 0) {
        const beforeUnloadListener = (e: BeforeUnloadEvent) => {
          e.preventDefault();
          e.returnValue = "Escape this shit?";
        };

        window.addEventListener("beforeunload", beforeUnloadListener);

        return () => {
          window.removeEventListener("beforeunload", beforeUnloadListener);
        };
      }
    }
  }, [productEntry]);

  async function makeReport() {
    if (Number(productEntry?.length) <= 0) {
      return console.log("do something");
    }
    setHasLoading(true);
    try {
      const response = await fetch("/api/outbound/make-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productEntry, formData }),
      });
      const reports: Orders = await response.json();
      await generatePdf(reports);
    } catch (error) {
      console.log(error);
    } finally {
      setHasLoading(false);
      setProductEntry([]);
      setFormData({
        barcodeId: "",
        truck: "",
        destination: "",
        clientName: "",
        productName: "",
        quantity: 0,
      });
    }
  }

  const generatePdf = async (orderReport: Orders | null) => {
    console.log("generate report executed");
    console.log(orderReport?.id);

    const doc = new jsPDF();

    // Add "Hello, World!" text to the PDF
    doc.text(`${orderReport?.clientName}`, 20, 40);
    doc.text(
      "--------------------------------------------------------------",
      10,
      10
    );
    doc.text("                  OUTBOUND ORDER REPORT", 10, 20);
    doc.text(
      "--------------------------------------------------------------",
      10,
      30
    );

    doc.text(`Order Date: ${String(orderReport?.dateCreated)}`, 20, 50);
    doc.text(`Order Number: ${orderReport?.id}`, 20, 60);
    doc.text(`Prepared by: ${orderReport?.users?.username}`, 20, 70);

    // Populate client information
    doc.text(
      "--------------------------------------------------------------",
      10,
      100
    );
    doc.text("Client Information:", 20, 110);
    doc.text(
      "--------------------------------------------------------------",
      10,
      120
    );
    doc.text(`Client Name: ${orderReport?.clientName}`, 20, 140);
    doc.text(`Shipping Address: ${orderReport?.destination}`, 20, 150);
    doc.text(`Contact Phone: 09511219514`, 20, 160);
    doc.text(`Email: client@gmail.com`, 20, 170);

    // Order Details Section (Using a loop for tabular data)
    var y = 120; // Set the initial Y-coordinate for the table
    var columnWidth = 45;

    doc.text("Order Details:", 10, 50);
    doc.line(10, y + 5, 200, y + 5); // Horizontal line under section title

    // Table headers
    doc.text("Product Name", 10, y + 15);
    doc.text("Barcode ID", 10 + columnWidth, y + 15);
    doc.text("Bin Location", 10 + 2 * columnWidth, y + 15);
    doc.text("SKU", 10 + 3 * columnWidth, y + 15);

    // Use a loop to add data rows here
    // Example:
    // doc.text('[Product Name 1]', 10, y + 30);
    // doc.text('[Barcode 1]', 10 + columnWidth, y + 30);
    // doc.text('[Bin 1]', 10 + 2 * columnWidth, y + 30);
    // doc.text('[SKU 1]', 10 + 3 * columnWidth, y + 30);

    // Continue adding rows in a similar fashion...

    // Order Total
    doc.text("Order Total: [Total Price for All Items]", 10, y + 120);

    // Notes
    doc.text("Notes: [Any Additional Notes]", 10, y + 135);

    // Thank you message
    doc.text("Thank you for choosing [Your Company Name]!", 10, y + 150);

    doc.save(`outbound_order_report_${orderReport?.id}.pdf`);
  };

  const inputStyle =
    "block w-full min-w-[20em] rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500";

  return (
    <>
      <Head>
        <title>{"Dashboard | Picking And Packing"}</title>
      </Head>

      <div className="flex h-full w-full flex-col gap-2 overflow-y-auto p-2 md:h-screen  md:flex-row md:justify-center md:p-4">
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
      </div>
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
