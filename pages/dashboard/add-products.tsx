import Layout from "@/components/layout";
import React, { useState } from "react";

interface Prod {
  barcodeId: string;
}

export default function AddProducts() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [barcodeId, setBarCodeId] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [sku, setSku] = useState<string>("");
  const [palletteLocation, setPalletteLocation] = useState<string>("");
  const [dateReceived, setDateReceive] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [poId, setpoId] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const inputStyle =
    "rounded-md py-3 px-4 focus:ring-4 focus:outline-none border-2";
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
    setIsLoading(true);
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
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBarCodeId("");
      setProductName("");
      setQuantity(0);
      setSku("");
      setPalletteLocation("");
      setDateReceive("");
      setExpirationDate("");
      setpoId("");
      setImage("");
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="border h-screen w-full p-3 font-bold">
        <form
          onSubmit={handleProduct}
          className="grid grid-rows-6 grid-flow-col gap-4"
        >
          <input
            type="text"
            value={barcodeId}
            className={inputStyle}
            onChange={(e) => setBarCodeId(e.target.value)}
          />

          <input
            type="text"
            value={productName}
            className={inputStyle}
            placeholder="product name"
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type="number"
            value={quantity}
            className={inputStyle}
            placeholder="quantity"
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
          <input
            type="text"
            value={sku}
            className={inputStyle}
            placeholder="sku"
            onChange={(e) => setSku(e.target.value)}
          />
          <input
            type="text"
            value={palletteLocation}
            className={inputStyle}
            placeholder="palletteLocation"
            onChange={(e) => setPalletteLocation(e.target.value)}
          />
          <input
            type="date"
            value={dateReceived}
            className={inputStyle}
            placeholder="date Received"
            onChange={(e) => setDateReceive(e.target.value)}
          />
          <input
            type="date"
            value={expirationDate}
            className={inputStyle}
            placeholder="expiration date"
            onChange={(e) => setExpirationDate(e.target.value)}
          />
          <input
            type="text"
            value={poId}
            className={inputStyle}
            placeholder="poId"
            onChange={(e) => setpoId(e.target.value)}
          />
          {/* <input
            type="text"
            value={image}
            className={inputStyle}
            placeholder="image"
            onChange={(e) => setImage(e.target.value)}
          /> */}
          <div className="flex justify-center items-center gap-2">
            <button
              type="button"
              className="text-gray-900 hover:text-white border w-full border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >
              Assign Location
            </button>
            <button
              type="button"
              className="text-gray-900 hover:text-white border w-full border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            >
              Add Image
            </button>
          </div>

          <button
            type="submit"
            className="w-full justify-center text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
          >
            {isLoading ? (
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 mr-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              "Save"
            )}
          </button>
        </form>
      </section>
    </Layout>
  );
}
