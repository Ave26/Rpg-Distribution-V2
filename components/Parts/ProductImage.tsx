import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Toast from "./Toast";

import noImage from "@/public/assets/products/noProductDisplay.png";
import Loading from "./Loading";

interface ProductImageProps {
  barcodeId: string | undefined;
}

interface Data {}

export default function ProductImage({
  barcodeId,
}: ProductImageProps): JSX.Element {
  const router = useRouter();
  const [productImage, setProductImage] = useState<string>("");
  const [message, setMessage] = useState<Object>();
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    if (barcodeId?.length === 14) {
      try {
        const response = await fetch("/api/product/find", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            barcodeId,
          }),
        });

        const json = await response.json();
        const product = await json?.product;

        setProductImage(product?.image);

        if (json?.authenticated === false || response.status === 403) {
          setMessage(json?.message);
          router.push("/login");
        }

        setIsLoading(false);
        setIsShow(true);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
  }, [barcodeId, router]);

  useEffect(() => {
    handleSubmit();
  }, [barcodeId, handleSubmit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [isShow]);

  return (
    <div className="flex h-full w-full flex-col flex-wrap items-center justify-center gap-2 border p-4">
      {isLoading ? (
        <Loading />
      ) : (
        <Image
          priority
          alt="Product Image"
          src={productImage || noImage}
          className="object-contain md:h-40 md:w-40"
          width={0}
          height={0}
        />
      )}
    </div>
  );
}
