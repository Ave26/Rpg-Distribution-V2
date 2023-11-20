import ReusableButton from "@/components/Parts/ReusableButton";
import ReusableInput from "@/components/Parts/ReusableInput";
import Layout from "@/components/layout";
import Image from "next/image";
import React, { useState, ReactElement, useRef, useEffect } from "react";
import noImg from "../../public/assets/products/noProductDisplay.png";
import Toast from "@/components/Parts/Toast";
import { stringify } from "querystring";
import DashboardLayout from "@/components/Admin/dashboardLayout";
import Head from "next/head";
import { products, stockKeepingUnit, Category } from "@prisma/client";
import Loading from "@/components/Parts/Loading";

type TOmitProducts = Omit<products, "id" | "supplyLevelStatus">;
type TOmitSKU = Omit<stockKeepingUnit, "id" | "productsId" | "barcodeId">;

type TProducts = TOmitProducts & {
  sku: TOmitSKU;
};

type TToast = {
  message: string;
  isShow: boolean;
};

// interface NewProduct {
//   barcodeId: string;
//   productName: string;
//   image: string | undefined;
//   price: number | undefined;
//   category: string | undefined;
//   sku: string;
// }

// const AddNewProduct = () => {
//   const categories: string[] = [
//     "Food",
//     "Laundry",
//     "Cosmetics",
//     "Sanitary",
//     "Cleaning",
//   ];

//   const [category, setCategory] = useState<string | undefined>(undefined);
//   const [isShow, setIsShow] = useState<boolean>(false);
//   const [msg, setMsg] = useState<string>("");
//   const [barcodeId, setBarcodeId] = useState<string>("");
//   const [productName, setProductName] = useState<string>("");
//   const [image, setImage] = useState<string>("");
//   const [price, setPrice] = useState<number>();
//   const [sku, setSku] = useState<string>("");

//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [data, setData] = useState<NewProduct | null>(null);

//   const ParsedBody: NewProduct = {
//     barcodeId,
//     category,
//     image,
//     price,
//     productName,
//     sku,
//   };

//   const handleAddProduct = async (e: React.MouseEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/product/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(ParsedBody),
//       });
//       const json = await response.json();
//       console.log(json);
//       if (response.status === 200) {
//         setIsShow(true);
//         setMsg(json?.message);

//         setIsLoading(false);
//         setCategory("Select Rack Category");
//         setProductName("");
//         setPrice(0);
//         setImage("");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsShow(false);
//     }, 2000);
//     return () => {
//       clearTimeout(timer);
//     };
//   }, [isShow]);

//   // useEffect(() => {
//   //   const timer = setTimeout(() => {
//   //     if (barcodeId) {
//   //       try {
//   //         (async () => {
//   //           const response = await fetch("/api/product/find", {
//   //             method: "POST",
//   //             headers: {
//   //               "Content-Type": "application/json",
//   //             },
//   //             body: JSON.stringify({
//   //               barcodeId,
//   //             }),
//   //           });

//   //           const json = await response.json();
//   //           const product = await json?.product;
//   //           setData(product);
//   //           if (response.status === 200) {
//   //             setIsShow(true);
//   //             setMsg(json?.message);
//   //           }
//   //         })();
//   //       } catch (error) {
//   //         console.log(error);
//   //       }
//   //     }
//   //   }, 500);
//   //   return () => {
//   //     clearTimeout(timer);
//   //   };
//   // }, [barcodeId]);

//   return (
//     <>
//       <Head>
//         <title>{"Dashboard | Add Product"}</title>
//       </Head>
//       <form
//         onSubmit={handleAddProduct}
//         className="flex h-full w-full flex-col gap-2  p-4 md:h-screen">
//         <div className="flex flex-col flex-wrap items-start justify-center px-10 py-5">
//           <ReusableInput
//             value={barcodeId}
//             disableLabel={true}
//             name="Barcode Id"
//             type="text"
//             onChange={(newValue) => {
//               setBarcodeId(newValue);
//             }}
//           />
//           <ReusableInput
//             value={productName}
//             disableLabel={true}
//             name="Product Name"
//             type="text"
//             onChange={(newValue) => {
//               setProductName(newValue);
//             }}
//           />

//           <ReusableInput
//             value={price}
//             disableLabel={true}
//             name="Price"
//             placeholder="0.00"
//             type="text"
//             onChange={(newValue) => {
//               const filteredValue = newValue.replace(/[^0-9.]/g, "");
//               setPrice(filteredValue);
//             }}
//           />
//           <ReusableInput
//             value={sku}
//             type="text"
//             disableLabel={true}
//             name="Stock Keeping Unit"
//             onChange={(value: string) => {
//               setSku(value);
//             }}
//           />

//           <select
//             className="my-5 h-fit w-full rounded-lg border border-black p-2 outline-none"
//             value={category}
//             onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
//               setCategory(e.target.value)
//             }>
//             <option>Select Rack Category</option>s
//             {categories.map((value, index) => {
//               return (
//                 <option key={index} value={value} className="h-full w-full">
//                   {value}
//                 </option>
//               );
//             })}
//           </select>
//         </div>

//         <div className="flex h-full w-full flex-col flex-wrap items-center justify-center gap-2 px-10">
//           <input
//             type="file"
//             accept="image/jpg, image/jpeg, image/png"
//             name="file"
//             onChange={(event: ChangeEvent<HTMLInputElement>) => {
//               const file = event.target?.files?.[0];
//               console.log(file);
//               if (file) {
//                 const reader = new FileReader();
//                 reader.onload = () => {
//                   const base64String = reader.result as string;
//                   setImage(base64String);
//                 };
//                 reader.readAsDataURL(file);
//                 console.log(reader);
//               }
//             }}
//             className="w-full break-all font-bold"
//           />
//           <div className="flex w-full items-center justify-center">
//             <Image
//               priority
//               src={image || noImg}
//               alt="productImg"
//               className="rounded-lg object-contain"
//               width={250}
//               height={250}
//             />
//           </div>

//           <div className="flex h-fit w-full flex-col items-center justify-center gap-2 p-2">
//             <ReusableButton
//               name={"Add Now"}
//               type="submit"
//               isLoading={isLoading}
//             />
//             <ReusableButton
//               name="Clear"
//               type="button"
//               onClick={() => {
//                 setBarcodeId("");
//                 setPrice(0);
//                 setProductName("");
//                 setImage("");
//               }}
//             />
//           </div>
//         </div>
//       </form>
//       {isShow && <Toast data={msg} isShow={isShow} />}
//     </>
//   );
// };
// export default AddNewProduct;

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
      code: "",
      color: "",
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

        data.ok &&
          setNewProduct({
            barcodeId: "",
            category: "Food",
            image: "",
            price: 0,
            productName: "",
            sku: {
              code: "",
              color: "",
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
    "mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700";

  const spanStyle = "flex items-start w-full h-full justify-between";

  return (
    <section className="text-md h-full w-full font-semibold transition-all">
      <form
        onSubmit={submitProduct}
        className="flex flex-wrap items-center justify-start gap-2">
        <div className="flex w-full flex-col items-start justify-center gap-2  border border-black p-2 md:w-[25em]">
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
              onChange={handleChange}>
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
          <span className={spanStyle}>
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
          </span>
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
        </div>

        <div className="flex h-80 w-full flex-wrap items-center justify-center overflow-y-scroll border border-black md:w-[30em]">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpg, image/jpeg, image/png"
            name="file"
            onChange={handleChange}
            className="w-full break-all font-bold"
          />
          <div className="flex h-full w-full items-center justify-center">
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
          className="rounded-lg border border-transparent bg-sky-200 p-2 transition-all hover:p-3 active:p-2">
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
