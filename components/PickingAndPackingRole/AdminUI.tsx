import { EntriesTypes } from "@/types/binEntries";
import { TFormData } from "@/types/inputTypes";
import { use, useEffect, useRef, useState } from "react";
import { trucks as TTrucks } from "@prisma/client";
import { Bin } from "@/types/inventory";
import useSWR from "swr";
import { Orders } from "@/types/ordersTypes";
import jsPDF from "jspdf";
import Head from "next/head";
import Search from "../Parts/Search";
import ReusableButton from "../Parts/ReusableButton";
import Loading from "../Parts/Loading";
import BinsLayout from "../BinsLayout";
import Toast from "../Parts/Toast";
import { TBins } from "@/types/binsTypes";
// import BatchInput from "../Parts/batchInput";

export default function PickingAndPacking({ trucks }: { trucks: TTrucks[] }) {
  const [productEntry, setProductEntry] = useState<EntriesTypes[] | null>([]);
  const [testTrucks, setTestTrucks] = useState<TTrucks[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [orderData, setOrderData] = useState("");
  const [hasLoading, setHasLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState<string[]>([]);
  const [truckCapacity, setTruckCapacity] = useState<number>(0);
  const [formData, setFormData] = useState<TFormData>({
    barcodeId: "",
    truck: String(trucks[0]?.name),
    destination: "",
    clientName: "",
    productName: "",
    quantity: 0,
    purchaseOrderOutbound: "",
    truckCargo: 0,
  });
  // console.log(formData);
  /* TODO
    CALCULATE THE ASSIGNEDPRODUCTS. FOR THE 
  */

  const capacityRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {}, [capacityRef]);

  const fetchTrucks = (url: string) => {
    fetch(url)
      .then((res) => res.json())
      .then((data: TTrucks[]) => {
        setTestTrucks(data);
      })
      .catch((error) => error);
  };

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      formData.purchaseOrderOutbound &&
        (() => {
          console.log("fetching");

          fetch("/api/outbound/purchaseOrders-find", {
            method: "POST",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              purchaseOrderOutbound: formData.purchaseOrderOutbound,
            }),
          })
            .then((res) => res.json())
            .then((data) => data)
            .catch((error) => error)
            .finally(() => console.log("fetch is done"));
        })();
    }, 2000);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [formData.purchaseOrderOutbound]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isShow]);

  useEffect(() => {
    if (!hasLoading) {
      setIsClick(false);
    }
    return () => setHasLoading(false);
  }, [hasLoading]);

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
    const data: TBins[] = await response.json();

    return data;
  };

  const {
    isLoading,
    data: bins,
    mutate,
  } = useSWR(`/api/bins/search`, fetcher, {
    refreshInterval: 1500,
  });

  useSWR(`/api/trucks/find-trucks`, fetchTrucks, {
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

  // async function makeReport() {
  //   if (Number(productEntry?.length) <= 0) {
  //     return console.log("do something");
  //   }
  //   setHasLoading(true);
  //   try {
  //     const response = await fetch("/api/outbound/make-report", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ productEntry, formData }),
  //     });
  //     const reports: Orders = await response.json();
  //     await generatePdf(reports);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setHasLoading(false);
  //     setProductEntry([]);
  //     setFormData({
  //       barcodeId: "",
  //       truck: "",
  //       destination: "",
  //       clientName: "",
  //       productName: "",
  //       quantity: 0,
  //     });
  //   }
  // }

  // const generatePdf = async (orderReport: Orders | null) => {
  //   console.log("generate report executed");
  //   console.log(orderReport?.id);

  //   const doc = new jsPDF();

  //   // Add "Hello, World!" text to the PDF
  //   doc.text(`${orderReport?.clientName}`, 20, 40);
  //   doc.text(
  //     "--------------------------------------------------------------",
  //     10,
  //     10
  //   );
  //   doc.text("                  OUTBOUND ORDER REPORT", 10, 20);
  //   doc.text(
  //     "--------------------------------------------------------------",
  //     10,
  //     30
  //   );

  //   doc.text(`Order Date: ${String(orderReport?.dateCreated)}`, 20, 50);
  //   doc.text(`Order Number: ${orderReport?.id}`, 20, 60);
  //   doc.text(`Prepared by: ${orderReport?.users?.username}`, 20, 70);

  //   // Populate client information
  //   doc.text(
  //     "--------------------------------------------------------------",
  //     10,
  //     100
  //   );
  //   doc.text("Client Information:", 20, 110);
  //   doc.text(
  //     "--------------------------------------------------------------",
  //     10,
  //     120
  //   );
  //   doc.text(`Client Name: ${orderReport?.clientName}`, 20, 140);
  //   doc.text(`Shipping Address: ${orderReport?.destination}`, 20, 150);
  //   doc.text(`Contact Phone: 09511219514`, 20, 160);
  //   doc.text(`Email: client@gmail.com`, 20, 170);

  //   // Order Details Section (Using a loop for tabular data)
  //   var y = 120; // Set the initial Y-coordinate for the table
  //   var columnWidth = 45;

  //   doc.text("Order Details:", 10, 50);
  //   doc.line(10, y + 5, 200, y + 5); // Horizontal line under section title

  //   // Table headers
  //   doc.text("Product Name", 10, y + 15);
  //   doc.text("Barcode ID", 10 + columnWidth, y + 15);
  //   doc.text("Bin Location", 10 + 2 * columnWidth, y + 15);
  //   doc.text("SKU", 10 + 3 * columnWidth, y + 15);

  //   // Use a loop to add data rows here
  //   // Example:
  //   // doc.text('[Product Name 1]', 10, y + 30);
  //   // doc.text('[Barcode 1]', 10 + columnWidth, y + 30);
  //   // doc.text('[Bin 1]', 10 + 2 * columnWidth, y + 30);
  //   // doc.text('[SKU 1]', 10 + 3 * columnWidth, y + 30);

  //   // Continue adding rows in a similar fashion...

  //   // Order Total
  //   doc.text("Order Total: [Total Price for All Items]", 10, y + 120);

  //   // Notes
  //   doc.text("Notes: [Any Additional Notes]", 10, y + 135);

  //   // Thank you message
  //   doc.text("Thank you for choosing [Your Company Name]!", 10, y + 150);

  //   doc.save(`outbound_order_report_${orderReport?.id}.pdf`);
  // };
  // console.log(trucks.find((truck) => truck.capacity === formData.truckCargo));

  useEffect(() => {
    console.log("truck capacity finding");
    const truck = testTrucks?.find((truck) => {
      return truck.name === formData.truck;
    });
    console.log(truck);
    setTruckCapacity(truck?.capacity!);
  }, [formData.truck, formData]);

  const inputStyle =
    "appearance-none select-none block w-full min-w-[20em] rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500";
  const buttonStyle =
    "rounded-lg border border-transparent bg-sky-200 p-2 transition-all hover:p-3 active:p-2";
  return (
    <>
      <Head>
        <title>{"Dashboard | Picking And Packing"}</title>
      </Head>

      <div className="flex h-full w-full flex-wrap gap-2 overflow-y-auto p-2 md:h-screen   md:items-start md:justify-start md:p-4">
        <div className=" flex h-full w-full flex-col gap-2 md:h-fit md:max-w-fit md:justify-start">
          <Search
            formData={formData}
            setFormData={setFormData}
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
            // disabled={isDisabled
            type="text"
            name="purchaseOrderOutbound"
            placeholder="purchaseOrderOutbound"
            onChange={handleChange}
            value={formData.purchaseOrderOutbound}
            className={inputStyle}
          />

          <input
            disabled={isDisabled}
            type="text"
            name="clientName"
            placeholder="Client Name"
            onChange={handleChange}
            value={formData.clientName}
            className={inputStyle}
          />
          {/* <BatchInput properties={}/> */}

          <select
            disabled={isDisabled}
            name="truck"
            value={formData.truck}
            onChange={handleChange}
            className={inputStyle}>
            {testTrucks &&
              testTrucks?.map((truck: TTrucks) => {
                return <option key={truck?.id}>{truck.name}</option>;
              })}
          </select>
          <h1 className={inputStyle}>Truck Capacity {truckCapacity}</h1>
          <input
            disabled={isDisabled}
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

          <div className="flex items-center justify-center">
            {isClick ? (
              <div className="flex h-14 w-full items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setIsDisabled(false);
                    setHasLoading(true);
                    fetch("/api/outbound/make-order", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        productEntry,
                        formData,
                      }),
                    })
                      .then((res) => {
                        setFormData({
                          barcodeId: "",
                          truck: "",
                          destination: "",
                          clientName: "",
                          productName: "",
                          quantity: 0,
                          purchaseOrderOutbound: "",
                          truckCargo: Number(trucks[0].capacity),
                        });

                        return res.json();
                      })
                      .then((data) => setOrderData(data.message))
                      .catch((error) => console.log(error))
                      .finally(() => {
                        setIsShow(true);
                        setHasLoading(false);
                        setProductEntry([]);
                      });
                  }}
                  className={buttonStyle}>
                  {hasLoading ? <Loading /> : "Confirm"}
                </button>
                <button
                  onClick={() => setIsClick(false)}
                  className={buttonStyle}>
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setIsClick(true)} className={buttonStyle}>
                Submit
              </button>
            )}
          </div>
        </div>
        {isLoading ? (
          <div className="flex h-full w-full max-w-3xl items-center justify-center border md:max-h-96">
            <Loading />
          </div>
        ) : (
          <div className="relative flex h-full w-fit flex-col items-center justify-start transition-all">
            <BinsLayout
              bins={bins}
              // truckCapacity={truckCapacity}
              formData={formData}
              isLoading={isLoading}
              setFormData={setFormData}
              trucks={testTrucks}
              setIsDisabled={setIsDisabled}
              dataEntries={{ productEntry, setProductEntry }}
            />
            <div className="relative h-[17em] w-full overflow-y-auto border border-black p-2 text-black  md:w-[45em]">
              {productEntry?.map((entry, index) => (
                <span
                  key={entry.barcodeId}
                  className={`relative my-2 flex h-1/4 w-full animate-emerge items-center justify-center gap-2 rounded-lg  border border-black`}>
                  <div className="flex h-full w-full flex-row items-center justify-between rounded-lg border border-slate-100/50 p-2 text-center">
                    <div className="flex flex-col items-start">
                      <h1>
                        <strong>{entry.productName}</strong>
                      </h1>

                      <p>
                        Covered Bin Count: {Number(entry.binIdsEntries.length)}
                      </p>
                    </div>

                    <div className="flex rounded-lg border bg-slate-100/30 px-4 py-2">
                      {entry.totalQuantity}
                    </div>
                  </div>
                  <button
                    className="h-full w-1/12 rounded-lg"
                    onClick={() => {
                      const updatedProductEntry = [...productEntry];
                      updatedProductEntry.splice(index, 1);
                      setProductEntry(updatedProductEntry);
                      setIsAnimate(true);

                      if (updatedProductEntry.length <= 0) {
                        setIsDisabled(false);
                      }
                    }}>
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <Toast data={orderData} isShow={isShow} />
    </>
  );
}
