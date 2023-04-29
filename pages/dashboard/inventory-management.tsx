import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";

interface PROD {
  id: string;
  barcodeId: string;
  productName: string;
  quantity: number;
  sku: string;
  palletteLocation: string;
  dateReceived: string;
  expirationDate: string;
  poId: string;
  image: string;
}

export default function InventoryManageMent() {
  const [data, setData] = useState<any>([]);

  console.log(data);

  const fetchProduct = async () => {
    try {
      const response = await fetch("/api/inventory-products");
      const json = await response.json();
      console.log(json);
      if (response.status === 200) {
        setData(json);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <Layout>
      <section className="h-screen w-full border">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Id
                </th>
                <th scope="col" className="px-6 py-3">
                  Barcode Id
                </th>
                <th scope="col" className="px-6 py-3">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3">
                  sku
                </th>
                <th scope="col" className="px-6 py-3">
                  pallette Location
                </th>
                <th scope="col" className="px-6 py-3">
                  date Received
                </th>
                <th scope="col" className="px-6 py-3">
                  expiration Date
                </th>
                <th scope="col" className="px-6 py-3">
                  poId
                </th>
                <th scope="col" className="px-6 py-3">
                  image
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((product: any) => {
                return (
                  <tr
                    key={product.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {product?.id}
                    </th>

                    <td className="px-6 py-4">{product?.barcodeId}</td>
                    <td className="px-6 py-4">{product?.productName}</td>
                    <td className="px-6 py-4">{product?.quantity}</td>
                    <td className="px-6 py-4">{product?.sku}</td>
                    <td className="px-6 py-4">{product?.palletteLocation}</td>
                    <td className="px-6 py-4">{product?.dateReceived}</td>
                    <td className="px-6 py-4">{product?.expirationDate}</td>
                    <td className="px-6 py-4">{product?.poId}</td>

                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                );
              })}
              {/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Microsoft Surface Pro
                </th>
                <td className="px-6 py-4">White</td>
                <td className="px-6 py-4">Laptop PC</td>
                <td className="px-6 py-4">$1999</td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </a>
                </td>
              </tr> */}

              {/* <tr className="bg-white dark:bg-gray-800">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  Magic Mouse 2
                </th>
                <td className="px-6 py-4">Black</td>
                <td className="px-6 py-4">Accessories</td>
                <td className="px-6 py-4">$99</td>
                <td className="px-6 py-4">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </a>
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </section>
      ;
    </Layout>
  );
}

// modify button
