import ReusableButton from "@/components/Parts/ReusableButton";
import ReusableInput from "@/components/Parts/ReusableInput";
import Layout from "@/components/layout";
import Image from "next/image";
import React, { useState, ReactElement, useRef, useEffect } from "react";
import noImg from "../../public/assets/products/noProductDisplay.png";
import Toast from "@/components/Parts/Toast";
import { stringify } from "querystring";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import { products, stockKeepingUnit, Category } from "@prisma/client";
import Loading from "@/components/Parts/Loading";
import { TProducts } from "@/types/productTypes";

type TToast = {
  message: string;
  isShow: boolean;
};

export default function AddNewProduct() {
  const CATEGORY = ["Food", "Laundry", "Cosmetics", "Sanitary", "Cleaning"];
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastData, setToastData] = useState<TToast>({
    isShow: false,
    message: "",
  });

  const [newProduct, setNewProduct] = useState<TProducts>({
    barcodeId: "",
    category: CATEGORY[0] as Category,
    image: "",
    price: 0,
    productName: "",
    sku: {
      threshold: 0,
      code: "",
      weight: 0,
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setToastData({
        ...toastData,
        isShow: false,
      });
    }, 2200);

    return () => {
      clearTimeout(timer);
    };
  }, [toastData.isShow]);

  function submitProduct(e: React.MouseEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    newProduct.price = parseInt(String(newProduct.price), 10);
    newProduct.sku.weight = parseInt(String(newProduct.sku.weight), 10);

    fetch("/api/product/create", {
      method: "POST",
      body: JSON.stringify({ newProduct }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setToastData({
          ...toastData,
          message: data.message,
          isShow: true,
        });

        setNewProduct({
          barcodeId: "",
          category: "Food",
          image: "",
          price: 0,
          productName: "",

          sku: {
            threshold: 0,
            code: "",
            weight: 0,
          },
        });
      })
      .catch((error) =>
        setToastData({
          isShow: true,
          message: error?.message,
        })
      )
      .finally(() => {
        fileInputRef.current && (fileInputRef.current.value = "");
        setIsLoading(false);
      });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;

    if (type === "file") {
      // Handle file input change
      console.log("image is working");
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;

      if (files) {
        const file = files[0];

        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result as string;

            setNewProduct({
              ...newProduct,
              image: base64String,
            });
          };
          reader.readAsDataURL(file);
        }
      }
    } else {
      setNewProduct((prevValue) => {
        if (name in prevValue.sku) {
          return {
            ...prevValue,
            sku: {
              ...prevValue.sku,
              [name]: value,
            },
          };
        } else {
          return {
            ...prevValue,
            [name]: value,
          };
        }
      });
    }
  }

  const inputStyle =
    "block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none";
  const labelStyle =
    "mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700 w-[10em] p-2";

  const spanStyle =
    "flex items-center flex-row w-full h-full justify-center gap-2";

  return (
    <section className="text-md h-full w-full  rounded-md bg-slate-200 font-semibold transition-all">
      <form
        onSubmit={submitProduct}
        className="flex flex-wrap items-center justify-start gap-2"
      >
        <div className="flex w-full flex-col items-start justify-center gap-3 whitespace-nowrap  p-2 md:w-[35em]">
          <span className={spanStyle}>
            <label htmlFor="barcodeId" className={labelStyle}>
              Barcode Id
            </label>
            <input
              id="barcodeId"
              className={inputStyle}
              value={newProduct.barcodeId}
              name="barcodeId"
              type="text"
              onChange={handleChange}
            />
          </span>
          <span className={spanStyle}>
            <label htmlFor="category" className={labelStyle}>
              Category
            </label>
            <select
              id="category"
              name="category"
              value={newProduct.category}
              className={inputStyle}
              onChange={handleChange}
            >
              {CATEGORY.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </span>
          <span className={spanStyle}>
            <label htmlFor="price" className={labelStyle}>
              Price
            </label>
            <input
              id="price"
              className={inputStyle}
              value={newProduct.price as number}
              name="price"
              type="text"
              onChange={handleChange}
            />
          </span>
          <span className={spanStyle}>
            <label htmlFor="productName" className={labelStyle}>
              Product Name
            </label>
            <input
              id="productName"
              className={inputStyle}
              value={newProduct.productName}
              name="productName"
              type="text"
              onChange={handleChange}
            />
          </span>
          <span className={spanStyle}>
            <label htmlFor="code" className={labelStyle}>
              Code
            </label>
            <input
              id="code"
              className={inputStyle}
              value={newProduct.sku.code}
              name="code"
              type="text"
              onChange={handleChange}
            />
          </span>
          {/* <span className={spanStyle}>
            <label htmlFor="color" className={labelStyle}>
              Color
            </label>
            <input
              id="color"
              className={inputStyle}
              value={newProduct.sku.color}
              name="color"
              type="text"
              onChange={handleChange}
            />
          </span> */}
          <span className={spanStyle}>
            <label htmlFor="weight" className={labelStyle}>
              Weight
            </label>
            <input
              id="weight"
              className={inputStyle}
              value={newProduct.sku.weight as number}
              name="weight"
              type="text"
              onChange={handleChange}
            />
          </span>
          <span className={spanStyle}>
            <label htmlFor="threshold" className={labelStyle}>
              Threshold
            </label>
            <input
              id="threshold"
              min={0}
              className={inputStyle}
              value={newProduct.sku.threshold as number}
              name="threshold"
              type="number"
              onChange={handleChange}
            />
          </span>
        </div>

        <div className="flex h-full w-full flex-wrap items-center justify-center overflow-y-scroll border border-black md:w-[30em]">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpg, image/jpeg, image/png"
            name="file"
            onChange={handleChange}
            className="w-full break-all font-bold"
          />
          <div className="flex h-[27.3em] w-full items-center justify-center">
            <Image
              priority
              src={newProduct.image || noImg}
              alt="productImg"
              className="rounded-lg object-contain"
              width={250}
              height={250}
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-lg border border-transparent bg-sky-200 p-2 transition-all hover:p-3 active:p-2"
        >
          {isLoading ? <Loading /> : "Submit"}
        </button>
      </form>
      <Toast data={toastData.message} isShow={toastData.isShow}></Toast>
    </section>
  );
}

AddNewProduct.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
