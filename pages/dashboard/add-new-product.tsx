import ReusableButton from "@/components/Parts/ReusableButton";
import ReusableInput from "@/components/Parts/ReusableInput";
import Layout from "@/components/layout";
import Image from "next/image";
import React, {
  useState,
  type FC,
  ChangeEvent,
  useEffect,
  ReactElement,
} from "react";
import noImg from "../../public/assets/products/noProductDisplay.png";
import Toast from "@/components/Parts/Toast";
import { stringify } from "querystring";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import Head from "next/head";
interface NewProduct {
  barcodeId: string;
  productName: string;
  image: string | undefined;
  price: number | undefined;
  category: string | undefined;
  sku: string;
}

const AddNewProduct = ({}): JSX.Element => {
  const categories: string[] = [
    "Food",
    "Laundry",
    "Cosmetics",
    "Sanitary",
    "Cleaning",
  ];

  const [category, setCategory] = useState<string | undefined>(undefined);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [barcodeId, setBarcodeId] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [sku, setSku] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<NewProduct | null>(null);

  const ParsedBody: NewProduct = {
    barcodeId,
    category,
    image,
    price,
    productName,
    sku,
  };

  const handleAddProduct = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ParsedBody),
      });
      const json = await response.json();
      console.log(json);
      if (response.status === 200) {
        setIsShow(true);
        setMsg(json?.message);

        setIsLoading(false);
        setCategory("Select Rack Category");
        setProductName("");
        setPrice(0);
        setImage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShow(false);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [isShow]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (barcodeId) {
  //       try {
  //         (async () => {
  //           const response = await fetch("/api/product/find", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               barcodeId,
  //             }),
  //           });

  //           const json = await response.json();
  //           const product = await json?.product;
  //           setData(product);
  //           if (response.status === 200) {
  //             setIsShow(true);
  //             setMsg(json?.message);
  //           }
  //         })();
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   }, 500);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [barcodeId]);

  return (
    <>
      <Head>
        <title>{"Dashboard | Add Product"}</title>
      </Head>
      <form
        onSubmit={handleAddProduct}
        className="flex h-screen w-full flex-col  gap-2 p-4">
        <div className="flex flex-col flex-wrap items-start justify-center px-10 py-5">
          <ReusableInput
            value={barcodeId}
            disableLabel={true}
            name="Barcode Id"
            type="text"
            onChange={(newValue) => {
              setBarcodeId(newValue);
            }}
          />
          <ReusableInput
            value={productName}
            disableLabel={true}
            name="Product Name"
            type="text"
            onChange={(newValue) => {
              setProductName(newValue);
            }}
          />

          <ReusableInput
            value={price}
            disableLabel={true}
            name="Price"
            placeholder="0.00"
            type="text"
            onChange={(newValue) => {
              const filteredValue = newValue.replace(/[^0-9.]/g, "");
              setPrice(filteredValue);
            }}
          />
          <ReusableInput
            value={sku}
            type="text"
            disableLabel={true}
            name="Stock Keeping Unit"
            onChange={(value: string) => {
              setSku(value);
            }}
          />

          <select
            className="my-5 h-fit w-full rounded-lg border border-black p-2 outline-none"
            value={category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setCategory(e.target.value)
            }>
            <option>Select Rack Category</option>s
            {categories.map((value, index) => {
              return (
                <option key={index} value={value} className="h-full w-full">
                  {value}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex h-full w-full flex-col flex-wrap items-center justify-center gap-2 px-10">
          <input
            type="file"
            accept="image/jpg, image/jpeg, image/png"
            name="file"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const file = event.target?.files?.[0];
              console.log(file);
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  const base64String = reader.result as string;
                  setImage(base64String);
                };
                reader.readAsDataURL(file);
                console.log(reader);
              }
            }}
            className="w-full break-all font-bold"
          />
          <div className="flex w-full items-center justify-center">
            <Image
              priority
              src={image || noImg}
              alt="productImg"
              className="rounded-lg object-contain"
              width={250}
              height={250}
            />
          </div>

          <div className="flex h-fit w-full flex-col items-center justify-center gap-2 p-2">
            <ReusableButton
              name={"Add Now"}
              type="submit"
              isLoading={isLoading}
            />
            <ReusableButton
              name="Clear"
              type="button"
              onClick={() => {
                setBarcodeId("");
                setPrice(0);
                setProductName("");
                setImage("");
              }}
            />
          </div>
        </div>
      </form>
      {isShow && <Toast data={msg} isShow={isShow} />}
    </>
  );
};
export default AddNewProduct;

AddNewProduct.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
