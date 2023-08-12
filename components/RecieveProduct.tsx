// import React, { useEffect, useState, ChangeEvent } from "react";
// import Toast from "@/components/Parts/Toast";
// import Image from "next/image";
// import { Product } from "@/types/types";

// export default function RecieveProduct() {
//   const productTypes = ["food", "laundry", "cosmetics", "sanitary", "cleaning"];
//   const [barcodeId, setBarcodeId] = useState<string>("");
//   const [img, setImg] = useState<string | undefined>(undefined);
//   const [productName, setProductName] = useState<string>("");
//   const [expiry, setExpiry] = useState<string>("");
//   const [price, setPrice] = useState<number>(0.0);
//   const [sku, setSku] = useState<string>("");
//   const [poId, setPoId] = useState<string>("");
//   const [status, setStatus] = useState<string>("");
//   const [palletteLoc, setPalletteLoc] = useState<string>("");
//   const [productType, setProductType] = useState<string>("");
//   const [quantity, setQuantity] = useState<number>(0);

//   const [data, setData] = useState<Product[]>([]);

//   const [show, setShow] = useState<boolean>(false);
//   setTimeout(() => {
//     setShow(false);
//   }, 5000);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       try {
//         (async () => {
//           try {
//             const response = await fetch("/api/product/find", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 barcodeId,
//               }),
//             });
//             const json = await response?.json();
//             const { img, productName, productLists }: Product =
//               await json?.product;

//             if (response.ok) {
//               setProductName(productName);
//               setImg(img);

//               productLists.filter((value) => {
//                 return value?.status === "good";
//               });

//               const {
//                 expirationDate,
//                 paletteLocation,
//                 poId,
//                 price,
//                 productType,
//                 quantity,
//                 sku,
//                 status,
//               } = productLists[0];

//               setExpiry(expirationDate);
//               setProductType(productType);
//               setPalletteLoc(paletteLocation);
//               setPrice(price);
//               setSku(sku);
//               setPoId(poId);
//               setStatus(status);
//             }

//             console.log(json);
//           } catch (error: any | unknown) {
//             console.log(error);
//             setProductName("");
//             setImg(undefined);

//             setExpiry("");
//             setProductType("");
//             setPalletteLoc("");
//             setPrice(0);
//             setSku("");
//             setPoId("");
//             setStatus("");
//           }
//         })();
//       } catch (error) {
//         console.log(error, "error from catch");
//       }
//     }, 1000); // Delay for 500ms

//     return () => {
//       clearTimeout(delayDebounceFn);
//     };
//   }, [barcodeId]);

//   const inputStyle =
//     "rounded-md px-5 focus:ring-4 focus:outline-none border-2 md:w-full text-lg";
//   return (
//     <>
//       <form
//         className="h-full w-full rounded-lg shadow-xl grid grid-cols-3 grid-flow-row gap-5 p-7"
//         onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
//           e.preventDefault();
//         }}>
//         <input
//           placeholder="barcode"
//           type="text"
//           name=""
//           id=""
//           value={barcodeId}
//           onChange={(e) => {
//             setBarcodeId(e.target.value);
//           }}
//           className={inputStyle}
//           autoFocus
//         />
//         <h1>{quantity}</h1>

//         <input
//           placeholder="productName"
//           type="text"
//           name=""
//           id=""
//           value={productName}
//           onChange={(e) => setProductName(e.target.value)}
//           className={inputStyle}
//         />
//         <input
//           placeholder="expiration date"
//           type="date"
//           name=""
//           id=""
//           value={expiry}
//           onChange={(e) => setExpiry(e.target.value)}
//           className={inputStyle}
//         />
//         <input
//           placeholder="price"
//           type="text"
//           name=""
//           id=""
//           value={price}
//           onChange={(e) => setPrice(Number(e.target.value))}
//           className={inputStyle}
//         />
//         <input
//           placeholder="sku"
//           type="text"
//           name=""
//           id=""
//           value={sku}
//           onChange={(e) => setSku(e.target.value)}
//           className={inputStyle}
//         />
//         <input
//           placeholder="poId"
//           type="text"
//           name=""
//           id=""
//           value={poId}
//           onChange={(e) => setPoId(e.target.value)}
//           className={inputStyle}
//         />

//         <select value={status} onChange={(e) => setStatus(e.target.value)}>
//           <option value="good">Good</option>
//           <option value="damage">Damage</option>
//         </select>

//         <input
//           placeholder="palletteLoc"
//           type="text"
//           name=""
//           id=""
//           value={palletteLoc}
//           onChange={(e) => setPalletteLoc(e.target.value)}
//           className={inputStyle}
//         />

//         <select
//           value={productType}
//           onChange={(e) => setProductType(e.target.value)}>
//           {productTypes.map((types, index) => {
//             return (
//               <option value={types} key={index}>
//                 {types}
//               </option>
//             );
//           })}
//         </select>

//         <input
//           type="file"
//           accept="image/jpg, image/jpeg, image/png"
//           name="file"
//           onChange={(event: ChangeEvent<HTMLInputElement>) => {
//             const file = event.target?.files?.[0];
//             console.log(file);
//             if (file) {
//               const reader = new FileReader();
//               reader.onload = () => {
//                 const base64String = reader.result as string;
//                 setImg(base64String);
//               };
//               reader.readAsDataURL(file);
//               console.log(reader);
//             }
//           }}
//         />

//         {img && (
//           <Image
//             src={img}
//             alt="productImg"
//             className="w-[20em] h-[20em]"
//             width={20}
//             height={20}
//           />
//         )}

//         <button
//           className="border p-2 rounded-xl hover:bg-slate-500"
//           type="button">
//           Assign Pallette Location
//         </button>

//         <button
//           className="border p-2 rounded-xl hover:bg-slate-500"
//           type="submit">
//           Save
//         </button>
//         {show && <Toast data={data} />}
//         {data
//           ? data.map((value) => {
//               return <p key={value.id}>{value.barcodeId}</p>;
//             })
//           : null}
//       </form>
//     </>
//   );
// }
