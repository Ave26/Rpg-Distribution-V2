import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TiMessageTyping } from "react-icons/ti";
import { BiQrScan } from "react-icons/bi";
import ReusableInput from "@/components/Parts/ReusableInput";
import Layout from "@/components/layout";
import Link from "next/link";
import noImg from "../../public/assets/products/noProductDisplay.png";
import ReusableButton from "@/components/Parts/ReusableButton";
import Toast from "@/components/Parts/Toast";
import Loading from "@/components/Parts/Loading";

interface Racks {
  categoriesId: string;
  id: string;
  isAvailable: boolean;
  name: string;
}
interface Bin {
  capacity: string;
  id: string;
  isAvailable: boolean;
  racksId: string;
}

function BarcodeScanner() {
  const boxSize = ["Small", "Medium", "Large"];
  const [barcodeId, setBarcodeId] = useState<string>("");
  const [purchaseOrder, setPurchaseOrder] = useState<string>("");
  const [boxValue, setBoxValue] = useState<string>("");
  const [expiration, setExpiration] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [isTypable, setisTypable] = useState<boolean>(false);
  const ref = useRef<string | null>(null);
  const [isToggle, setIsToggle] = useState<boolean>(false);
  const [section, setSection] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [racks, setRacks] = useState<Racks[]>([]);
  const [rackName, setRackName] = useState<string>("");
  const [bin, setBin] = useState<Bin[] | undefined>([]);

  useEffect(() => {
    if (barcodeId != "") {
      ref.current = barcodeId;
    }
  }, [barcodeId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isShow]);

  useEffect(() => {
    console.log("rendering");
    if (!isTypable) {
      setTimeout(() => {
        setBarcodeId("");
      }, 200);
    }
  }, [isTypable, barcodeId]);

  // find the racks corresponds to the barcodeId Category
  async function fetchRack() {
    try {
      const response = await fetch("/api/racks/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barcodeId: ref.current,
          rackName,
        }),
      });
      const json = await response.json();
      setRacks(json?.racks);
      setBin(json?.bin);
      console.log(json?.bin);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isTypable) {
      const timer = setTimeout(() => {
        fetchRack();
        return () => {
          clearTimeout(timer);
        };
      }, 2500);
    } else {
      fetchRack();
    }
  }, [barcodeId]);

  useEffect(() => {
    fetchRack();
  }, [rackName]);

  return (
    <Layout>
      <section className="h-full w-full break-all font-bold">
        <div className="border border-black">
          <div className="flex flex-wrap items-center justify-start">
            <ReusableInput
              type="text"
              name="Barcode Id:"
              value={barcodeId}
              placeholder="barcodeid"
              onChange={(newValue) => {
                setBarcodeId(newValue);
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setisTypable((prevType) => !prevType);
              }}
              className="py-2w max-w- flex h-[3.7em] items-center justify-center border border-black">
              {isTypable ? (
                <TiMessageTyping className="h-full w-full border-black" />
              ) : (
                <BiQrScan className="h-full w-full border-black" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-center">
            <ReusableInput
              type="text"
              name="Purchase Order:"
              value={purchaseOrder}
              placeholder="purchaseOrder"
              onChange={(newValue) => {
                setPurchaseOrder(newValue);
              }}
            />
            <h1 className="mx-2 flex h-20 w-full items-center justify-center border border-black">
              {quantity}
            </h1>
          </div>
          <div className="flex w-full flex-wrap items-center justify-center gap-20 py-2">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                value=""
                className="peer sr-only"
                onClick={() => {
                  setIsToggle((prevToggle) => !prevToggle);
                }}
              />
              <div className="peer h-7 w-14 rounded-full bg-gray-200 after:absolute after:left-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-green-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                {isToggle ? "Damage" : "Good"}
              </span>
            </label>
            <div>
              <select
                className="p-2"
                value={boxValue}
                onChange={(e) => {
                  setBoxValue(e.target.value);
                }}>
                <option>Choose Box Size</option>
                {boxSize.map((value, index) => {
                  return <option key={index}>{value}</option>;
                })}
              </select>
            </div>
          </div>
          <ReusableInput
            name="Expiration Date"
            type="date"
            value={expiration}
            placeholder="expiry"
            onChange={(newValue) => {
              setExpiration(newValue);
            }}
          />
          {ref.current && (
            <h1 className="mt-2 w-fit max-w-full cursor-pointer select-none break-all border border-blue-400 p-2 drop-shadow-sm">
              {String(ref.current)}
            </h1>
          )}
          {isLoading ? (
            <Loading />
          ) : (
            <Image
              priority
              src={data?.product?.image || noImg}
              alt="productImg"
              className="h-[20em] w-[20em]"
              width={256}
              height={256}
            />
          )}
          <Link href="/dashboard/add-new-product">Add new Product</Link>
        </div>

        <button
          className="border border-black p-3"
          onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            setIsShow(true);
            console.log("click");
            try {
              const response = await fetch("/api/product/scan", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  barcodeId: ref.current,
                  boxValue,
                }),
              });
              const json = await response.json();
              setData(json?.message);
              console.log(json?.message);
            } catch (error: unknown) {
              console.log(error);
            }
          }}>
          Click to Test
        </button>
        <select
          className="relative"
          value={rackName}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setRackName(e.target.value)
          }>
          <option>Select Rack</option>
          {racks
            ?.filter((rack) => {
              return rack.isAvailable === true;
            })
            .map((rack) => {
              return (
                <option key={rack?.id} className="text-center">
                  {rack?.name}
                </option>
              );
            })}
        </select>
      </section>
      <Toast isShow={isShow} data={data} />
      {bin?.map((data, index) => {
        return (
          <div key={data.id}>
            {String(data.isAvailable)} {data.racksId} {index}
          </div>
        );
      })}
    </Layout>
  );
}

export default BarcodeScanner;
