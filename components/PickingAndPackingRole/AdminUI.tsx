import { EntriesTypes } from "@/types/binEntries";
import { TFormData } from "@/types/inputTypes";
import { useEffect, useRef, useState } from "react";
import {
  trucks as TTrucks,
  assignedProducts,
  bins,
  products,
  stockKeepingUnit,
} from "@prisma/client";
import useSWR from "swr";
import Head from "next/head";
import Search from "../Parts/Search";
import ReusableButton from "../Parts/ReusableButton";
import Loading from "../Parts/Loading";
// import BinsLayout from "../BinsLayout";
import Toast from "../Parts/Toast";

type TBins = bins & {
  _count: {
    assignedProducts: number;
  };
  assignedProducts: TAssignedProducts[];
};

type TAssignedProducts = assignedProducts & {
  sku: stockKeepingUnit;
  products: products;
};

//{ trucks }: { trucks: TTrucks[] }1

export default function PickingAndPacking() {
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
    truck: "", // String(trucks[0]?.truckName)
    destination: "",
    clientName: "",
    productName: "",
    quantity: 0,
    purchaseOrderOutbound: "",
    truckCargo: 0,
  });

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
      ...formData,
      [name]: value,
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

  console.log(formData);
  useEffect(() => {
    console.log("truck capacity finding");
    const truck = testTrucks?.find((truck) => {
      return truck.truckName === formData.truck;
    });
    setTruckCapacity(truck?.payloadCapacity!);
  }, [formData.truck, formData, testTrucks]);

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
            disabled={isDisabled}
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
            className={inputStyle}
          >
            {testTrucks &&
              testTrucks?.map((truck: TTrucks) => {
                return <option key={truck?.id}>{truck.truckName}</option>;
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
                        // setFormData({
                        //   barcodeId: "",
                        //   truck: "",
                        //   destination: "",
                        //   clientName: "",
                        //   productName: "",
                        //   quantity: 0,
                        //   purchaseOrderOutbound: "",
                        //   truckCargo: Number(trucks[0].capacity),
                        // });

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
                  className={buttonStyle}
                >
                  {hasLoading ? <Loading /> : "Confirm"}
                </button>
                <button
                  onClick={() => setIsClick(false)}
                  className={buttonStyle}
                >
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
            {/* <BinsLayout
              bins={bins}
              // truckCapacity={truckCapacity}
              formData={formData}
              isLoading={isLoading}
              setFormData={setFormData}
              trucks={testTrucks}
              setIsDisabled={setIsDisabled}
              dataEntries={{ productEntry, setProductEntry }}
            /> */}
            <div className="relative h-[17em] w-full overflow-y-auto border border-black p-2 text-black  md:w-[45em]">
              {productEntry?.map((entry, index) => (
                <span
                  key={entry.barcodeId}
                  className={`relative my-2 flex h-1/4 w-full animate-emerge items-center justify-center gap-2 rounded-lg  border border-black`}
                >
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
                    }}
                  >
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

/* 
  Need a massive refactor for admin UI

*/
