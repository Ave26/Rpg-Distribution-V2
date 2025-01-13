import DashboardLayout from "@/components/Admin/dashboardLayout";
import Layout from "@/components/layout";
import Input from "@/components/Parts/Input";
import useCategories from "@/hooks/useCategories";
import { buttonStyleSubmit, InputStyle } from "@/styles/style";
import Image from "next/image";
import React, { ReactElement, useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaCloudUploadAlt } from "react-icons/fa";
import { CreateProduct, InventoryMethod } from "../api/products/create";

type States = {
  product: CreateProduct;
  setProduct: React.Dispatch<React.SetStateAction<CreateProduct>>;
};

export default function AddProduct() {
  /* Barcode: 10293847561234 - SKU: SKU-10293
Barcode: 47382910564782 - SKU: SKU-47382
Barcode: 92746102837456 - SKU: SKU-92746
Barcode: 38475692018465 - SKU: SKU-38475
Barcode: 67584930215672 - SKU: SKU-67584
Barcode: 19482753674820 - SKU: SKU-19482
Barcode: 50817263948576 - SKU: SKU-50817 --
Barcode: 28754930182765 - SKU: SKU-28754
Barcode: 10394758620183 - SKU: SKU-10394
Barcode: 56781930467251 - SKU: SKU-56781 */

  return (
    <div className="flex h-full w-full flex-wrap gap-2 bg-white p-2">
      <div className="w-full lg:w-1/2">
        <Form />
      </div>

      <div className="flex h-full w-1/2 items-center justify-center  p-2">
        <ProductView />
      </div>
    </div>
  );
}

function Form() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<CreateProduct>({
    category: "default",
    barcodeId: "",
    code: "",
    image: "",
    productName: "",
    supplierName: "",
    price: 0,
    threshold: 0,
    weight: 0,
    method: "default",
  });
  const { categories } = useCategories();
  const { category, method, image, ...rest } = product;
  const methods: InventoryMethod[] = ["FEFO", "FIFO", "LIFO"];

  return (
    <form
      className="grid h-fit grid-flow-row grid-cols-2 gap-2 p-2"
      // onSubmit={(e) => {
      //   console.log("triggered");
      //   e.preventDefault();
      //   setLoading(true);
      //   fetch("/api/products/create", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(product),
      //   }).finally(() => {
      //     setProduct({
      //       category: "default",
      //       barcodeId: "",
      //       code: "",
      //       image: "",
      //       productName: "",
      //       supplierName: "",
      //       price: 0,
      //       threshold: 0,
      //       weight: 0,
      //       method: "default",
      //     });
      //     setLoading(false);
      //   });
      // }}
    >
      <div className="col-span-2 flex gap-2">
        <select
          name={category}
          value={category}
          onChange={(e) =>
            setProduct((prev) => ({ ...prev, category: e.target.value }))
          }
          className={InputStyle}
        >
          <option value={"default"} disabled>
            Select Category
          </option>
          {Array.isArray(categories) &&
            categories.map(({ category }) => {
              return (
                <option key={category} value={category}>
                  {category}
                </option>
              );
            })}
        </select>

        <button
          type="button"
          className="flex w-fit items-center justify-center hover:rotate-12 active:scale-90"
          onClick={() => {
            setProduct({
              category: "default",
              barcodeId: "",
              code: "",
              image: "",
              productName: "",
              supplierName: "",
              price: 0,
              threshold: 0,
              weight: 0,
              method: "default",
            });
          }}
        >
          remove
        </button>
      </div>

      <select
        name={method}
        value={method}
        onChange={(e) =>
          setProduct((prev) => ({
            ...prev,
            method: e.target.value as InventoryMethod,
          }))
        }
        className={`${InputStyle} col-span-2`}
      >
        <option value={"default"} disabled>
          Select Method
        </option>
        {Array.isArray(methods) &&
          methods.map((method) => {
            return (
              <option key={method} value={method}>
                {method}
              </option>
            );
          })}
      </select>

      <div className="w-ful flex h-fit flex-col gap-2">
        {Object.keys(rest).map((key) => {
          const isString =
            typeof product[key as keyof CreateProduct] === "string";
          return (
            <Input
              key={key}
              attributes={{
                input: {
                  id: key,
                  name: key,
                  type: isString ? "text" : "number",
                  value: product[key as keyof CreateProduct] as string,

                  onChange: (e) => {
                    const { name, value } = e.target;
                    setProduct({
                      ...product,
                      [name]: isString
                        ? value.trim().toUpperCase()
                        : parseInt(value),
                    });
                  },
                },
                label: { htmlFor: key, children: key },
              }}
            />
          );
        })}
      </div>

      <div className="col-span-1 flex h-full w-full select-none flex-col items-center justify-center rounded-sm border-2 border-dotted border-sky-600">
        <div
          className=""
          // typeof="button"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <ImageView image={product.image} />
        </div>
        <FileUpload states={{ product, setProduct }} />
      </div>

      <button
        className={`${buttonStyleSubmit} col-span-2`}
        type="button"
        onClick={() => {
          console.log("triggered");
          // e.preventDefault();
          setLoading(true);
          fetch("/api/products/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
          }).finally(() => {
            setProduct({
              category: "default",
              barcodeId: "",
              code: "",
              image: "",
              productName: "",
              supplierName: "",
              price: 0,
              threshold: 0,
              weight: 0,
              method: "default",
            });
            setLoading(false);
          });
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <AiOutlineLoading className="animate-spin" size={30} />
          </div>
        ) : (
          "submit"
        )}
      </button>
      <div className="col-span-2">{JSON.stringify(product, null, 2)}</div>
    </form>
  );
}

function ProductView() {
  return <>ProductView</>;
}

function ImageView({ image }: { image: string | null }) {
  return (
    <>
      {image ? (
        <div className="relative flex h-64 w-64 items-center justify-center">
          <Image priority src={image} alt={"product"} fill sizes="100" />
        </div>
      ) : (
        <>
          <FaCloudUploadAlt size={100} className="text-slate-500" />
          <h1>Drop your image</h1>
        </>
      )}
    </>
  );
}

import { CldUploadWidget } from "next-cloudinary";

function FileUpload({ states }: { states: States }) {
  const { product, setProduct } = states;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handleSuccess = (result: any) => {
    if (result.event === "success") {
      console.log("Upload Success:", result.info); // Debug log
      setPhotoUrl(result.info.secure_url); // Set the uploaded image URL to state
      setProduct((prev) => ({ ...prev, image: result.info.secure_url }));
    } else {
      console.log("Upload Event:", result.event); // Debug log for other events
    }
  };

  return (
    <div className="hidden">
      <CldUploadWidget
        // uploadPreset={"rpgprostock26"}
        uploadPreset={
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rpgprostock26"
        }
        options={{
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        }}
        onSuccess={(res) => {
          console.log("onSuccess Triggered:", res); // Check if this logs
          handleSuccess(res); // Process the result
        }}
      >
        {({ open }) => (
          <button type="button" id="file-upload" onClick={() => open()}>
            Upload an Image
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}

AddProduct.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
