import Loading from "@/components/Parts/Loading";
import { trucks, records, orderedProducts, products } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { FaBackspace } from "react-icons/fa";

type TOmitTrucks = Omit<trucks, "driverId">;
type TOmitRecord = Omit<
  records,
  "clientName" | "dateCreated" | "destination" | "username" | "truckName"
>;

type TTrucks = TOmitTrucks & {
  records: TOmitRecord[];
};

type TCargoProps = {
  dataCargo: TDataCargo;
  truckData: TTrucks;
};

type TStyle = "animate-emerge" | "animate-fade";

type TCargo = {
  animate: boolean;
  style: TStyle;
};

type TDataCargo = {
  isCargoOpen: TCargo;
  setIsCargoOpen: React.Dispatch<React.SetStateAction<TCargo>>;
};

type TCargoKey = Record<TStyle, boolean>;

type TRecords = records & {
  orderedProducts: TOrderedProducts[];
};

type TOrderedProducts = orderedProducts & {
  products: products;
};

export default function Cargo({ dataCargo, truckData }: TCargoProps) {
  const { isCargoOpen, setIsCargoOpen } = dataCargo;
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<TRecords[]>();
  const [productOrder, setProductOrder] = useState<TOrderedProducts | null>(
    null
  );

  useEffect(() => {
    let controller = new AbortController();
    setIsLoading(true);
    truckData.records &&
      (async () => {
        try {
          const response = await fetch("/api/records/find-records", {
            method: "POST",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recordsId: truckData.records,
            }),
          });
          const records = await response.json();
          setRecords(records);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      })();

    return () => {
      isCargoOpen.animate || controller.abort();
    };
  }, []);

  return (
    <div
      className={`${isCargoOpen.style} absolute h-[100em] w-full overflow-y-scroll bg-white/30 backdrop-blur-sm`}
      onAnimationEnd={() => {
        let keyCargo: TCargoKey = {
          "animate-emerge": true,
          "animate-fade": false,
        };
        setIsCargoOpen({
          ...isCargoOpen,
          animate: keyCargo[isCargoOpen.style],
        });
      }}>
      <button
        onClick={() =>
          setIsCargoOpen({
            ...isCargoOpen,
            style: "animate-fade",
          })
        }
        className="sticky left-2 top-2">
        <FaBackspace />
      </button>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="h-full w-full border border-black">
          <div>
            {records?.map((record) => (
              <div key={record.id}>
                <h1>{record.truckName}</h1>
                <h1>{record.clientName}</h1>
                <h1>{String(record.dateCreated)}</h1>
                <h1>{record.username}</h1>
                <h1>{record.id}</h1>
                <select value="">
                  {record.orderedProducts?.map((orderedProduct) => (
                    <option
                      key={orderedProduct.id}
                      className="just flex flex-col items-center justify-center">
                      <h1>
                        Quantity: {orderedProduct.totalQuantity} Name:
                        {orderedProduct.products.productName}
                      </h1>
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}