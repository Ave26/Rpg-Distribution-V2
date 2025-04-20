import JsBarcode from "jsbarcode";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  //   Image,
  Document,
  Page,
  StyleSheet,
} from "@react-pdf/renderer";
interface BarcodeProps {
  value: string;
}

function Barcode({ value }: BarcodeProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [barcodeImage, setBarcodeImage] = useState<string>("");
  useEffect(() => {
    if (barcodeRef.current && value.trim() !== "") {
      // Only generate barcode if value is not empty
      JsBarcode(barcodeRef.current, value, {
        format: "CODE128",
        displayValue: true,
        fontSize: 16,
        height: 60,
        margin: 10,
        // format: "CODE128",
        // width: 0.75, // narrower bars
        // height: 50, // shorter barcode
        // fontSize: 10, // smaller text
        // displayValue: true, // show the URL under the barcode (optional)
      });

      // Convert SVG to Base64 image
      const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
      const base64Image = `data:image/svg+xml;base64,${btoa(svgData)}`;
      setBarcodeImage(base64Image);
    }
  }, [value]);

  return value.trim() !== "" ? (
    <>
      <svg ref={barcodeRef} />
      {/* <Image src={barcodeImage} alt={"asdasd"} width={100} height={100} /> */}
    </>
  ) : (
    <div>No Barcode Available</div>
  );
}

export default Barcode;
