import React, { ReactElement, useCallback, useEffect, useState } from "react";
import Layout from "@/components/layout";
import Loading from "@/components/Parts/Loading";
import DashboardLayout from "@/components/Admin/dashboardLayout";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/inventory-products");
      const jsonData = await response.json();
      response.status === 200 && setData(jsonData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Layout>
      <section className="h-screen w-full border">
        <div className="relative h-full overflow-x-auto shadow-md sm:rounded-lg">
          {isLoading ? (
            <div className="flex h-screen items-center justify-center">
              <Loading />
            </div>
          ) : (
            <table className="h-screen w-full overflow-y-scroll text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
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
                {data?.map((product: any) => {
                  return (
                    <tr
                      key={product.id}
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
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
                          className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                          Edit
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </Layout>
  );
}

InventoryManageMent.getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <DashboardLayout>{page}</DashboardLayout>
    </Layout>
  );
};
