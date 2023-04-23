// import React, { useState } from "react";
// import Layout from "@/components/layout";
// import { useRouter } from "next/router";

// import { HiArrowNarrowLeft } from "react-icons/hi";

// export default function AddProducts() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const backToStaffPage = async () => {
//     router.push("/");
//   };

//   interface Prod {
//     barcodeId: string;
//     expirationDate: string;
//     palletteLocation: string;
//     poId: string;
//     productName: string;
//     quantity: number;
//     sku: string;
//     dateReceived: string;
//     image: string;
//   }

//   const [product, setProduct] = useState<Prod>({
//     barcodeId: "",
//     expirationDate: "",
//     palletteLocation: "",
//     poId: "",
//     productName: "",
//     quantity: 0,
//     sku: "",
//     dateReceived: "",
//     image: "",
//   });

//   const requestBody = JSON.stringify({
//     barcodeId: product.barcodeId,
//     expirationDate: product.expirationDate,
//     palletteLocation: product.palletteLocation,
//     poId: product.poId,
//     productName: product.productName,
//     quantity: product.quantity,
//     sku: product.sku,
//     dateReceived: product.dateReceived,
//     image: "",
//   });

//   const AddProducts = async () => {
//     console.log("click");
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/add-products", {
//         method: "POST",
//         body: requestBody,

//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (response.status === 200) {
//         setIsLoading(false);
//       }
//       console.log(response);
//     } catch (error) {
//       console.log(error);
//       setIsLoading(false);
//     } finally {
//       setProduct({
//         barcodeId: "",
//         expirationDate: "",
//         palletteLocation: "",
//         poId: "",
//         productName: "",
//         quantity: 0,
//         sku: "",
//         dateReceived: "",
//         image: "",
//       });
//     }
//   };

//   return (
//     <Layout>
//       <section className="flex justify-center items-center flex-col gap-5  border-black border">
//         {/* <HiArrowNarrowLeft
//           className="w-7 h-8 m-4 border"
//           onClick={backToStaffPage}
//         /> */}
//         <form
//           onSubmit={AddProducts}
//           className="m-4 flex justify-between items-between flex-col h-full w-2/5 gap-3 px-5 shadow-lg rounded-lg border font-extrabold"
//         >
//           <p className="text-xs">Barcode Id:</p>
//           <input
//             type="text"
//             value={product.barcodeId}
//             onChange={(e) => {
//               setProduct({ ...product, barcodeId: e.target.value });
//             }}
//             className="rounded-md py-2 px-3 focus:ring-4 focus:outline-none border-2"
//           />

//           <p className="text-xs">Product Name:</p>
//           <input
//             type="text"
//             value={product.productName}
//             onChange={(e) => {
//               setProduct({ ...product, productName: e.target.value });
//             }}
//             className="rounded-md py-2 px-3 focus:ring-4 focus:outline-none border-2"
//           />

//           <div className="flex justify-center items-center gap-20">
//             <div>
//               <p className="text-xs">Quantity:</p>
//               <input
//                 type="number"
//                 value={product.quantity}
//                 onChange={(e) => {
//                   setProduct({
//                     ...product,
//                     quantity: parseInt(e.target.value),
//                   });
//                 }}
//                 className="rounded-md py-2 px-3 focus:ring-4 focus:outline-none border-2"
//               />
//             </div>
//             <div>
//               <p className="text-xs">SKU:</p>
//               <input
//                 type="text"
//                 value={product.sku}
//                 onChange={(e) => {
//                   setProduct({ ...product, sku: e.target.value });
//                 }}
//                 className="rounded-md py-2 px-3 focus:ring-4 focus:outline-none border-2"
//               />
//             </div>
//           </div>

//           <p className="text-xs">Pallette Location:</p>
//           <input
//             type="text"
//             value={product.palletteLocation}
//             onChange={(e) => {
//               setProduct({ ...product, palletteLocation: e.target.value });
//             }}
//             className="rounded-md py-2 px-3 focus:ring-4 focus:outline-none border-2"
//           />
//           <p className="text-xs">Data Received:</p>
//           <input
//             type="date"
//             value={product.dateReceived}
//             onChange={(e) => {
//               setProduct({ ...product, dateReceived: e.target.value });
//             }}
//             className="rounded-md py-2 px-3 focus:ring-4 focus:outline-none border-2"
//           />
//           <p className="text-xs">Expiration Date:</p>
//           <input
//             type="date"
//             value={product.expirationDate}
//             onChange={(e) => {
//               setProduct({ ...product, expirationDate: e.target.value });
//             }}
//             className="rounded-md py-2 px-3 focus:ring-4 focus:outline-none border-2"
//           />
//           <p className="text-xs">PO ID:</p>
//           <input
//             type="text"
//             value={product.poId}
//             onChange={(e) => {
//               setProduct({ ...product, poId: e.target.value });
//             }}
//             className="rounded-md py-2 px-3 focus:ring-4 focus:outline-none border-2"
//           />
//           <div className=" flex justify-center items-start flex-col gap-2">
//             <button
//               type="submit"
//               className="w-full justify-center text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
//             >
//               {/* {isLoading ? (
//                 <svg
//                   aria-hidden="true"
//                   role="status"
//                   className="inline w-4 h-4 mr-3 text-white animate-spin"
//                   viewBox="0 0 100 101"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
//                     fill="#E5E7EB"
//                   />
//                   <path
//                     d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
//                     fill="currentColor"
//                   />
//                 </svg>
//               ) : (
//                 "Save"
//               )} */}
//               save
//             </button>
//             <button
//               type="button"
//               className="text-gray-900 hover:text-white border w-full border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
//             >
//               Assign Location
//             </button>
//           </div>
//         </form>
//       </section>
//     </Layout>
//   );
// }

import Layout from "@/components/layout";
import React, { useState } from "react";

interface Prod {
  barcodeId: string;
}

export default function AddProducts() {
  const [barcodeId, setBarCodeId] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [sku, setSku] = useState<string>("");
  const [palletteLocation, setPalletteLocation] = useState<string>("");
  const [dateReceived, setDateReceive] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [poId, setpoId] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const body = {
    barcodeId,
    productName,
    quantity,
    sku,
    palletteLocation,
    dateReceived,
    expirationDate,
    poId,
    image,
  };

  const handleProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("click");

    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <form
        onSubmit={handleProduct}
        className="flex justify-center items-center flex-col"
      >
        <input
          type="text"
          value={barcodeId}
          placeholder="barcode id"
          onChange={(e) => setBarCodeId(e.target.value)}
        />
        <input
          type="text"
          value={productName}
          placeholder="product name"
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number"
          value={quantity}
          placeholder="quantity"
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
        <input
          type="text"
          value={sku}
          placeholder="sku"
          onChange={(e) => setSku(e.target.value)}
        />
        <input
          type="text"
          value={palletteLocation}
          placeholder="palletteLocation"
          onChange={(e) => setPalletteLocation(e.target.value)}
        />
        <input
          type="date"
          value={dateReceived}
          placeholder="date Received"
          onChange={(e) => setDateReceive(e.target.value)}
        />
        <input
          type="date"
          value={expirationDate}
          placeholder="expiration date"
          onChange={(e) => setExpirationDate(e.target.value)}
        />
        <input
          type="text"
          value={poId}
          placeholder="poId"
          onChange={(e) => setpoId(e.target.value)}
        />
        <input
          type="text"
          value={image}
          placeholder="image"
          onChange={(e) => setImage(e.target.value)}
        />

        <button type="submit">save</button>
      </form>
    </Layout>
  );
}
