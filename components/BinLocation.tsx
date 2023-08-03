import React, { useEffect, useState } from "react";
import { Racks, Bin } from "@/types/types";
interface BinLocationProps {
  barcodeId: string;
}

function BinLocation({ barcodeId }: BinLocationProps) {
  const [racks, setRacks] = useState<Racks[] | undefined>([]);
  const [bins, setBins] = useState<Bin[] | undefined>([]);

  async function findRacks(abortController: AbortController) {
    try {
      const response = await fetch("/api/racks/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barcodeId,
        }),
        signal: abortController.signal,
      });

      const json: Racks = await response.json();
      console.log(json);
      const binData: Bin[] = json?.bin;
      setBins(binData);
      // setRacks(json);
      if (response.status === 403) {
        setRacks(undefined);
      }
      if (response.status === 404) {
        setRacks(undefined);
      }
      console.log(json?.bin);
      const manyBins = json?.bin;

      setBins(json?.bin);
    } catch (error) {
      console.log(error);
    }
  }
  console.log(bins);
  useEffect(() => {
    const abortController = new AbortController();
    if (barcodeId != null) {
      findRacks(abortController);
    }
    return () => {
      abortController.abort();
    };
  }, [barcodeId]);
  return (
    <div>
      {bins?.map((bin) => {
        return (
          <div key={bin?._id}>
            {bin?.row} - {bin?.shelfLevel}
          </div>
        );
      })}
    </div>
  );
}

export default BinLocation;
