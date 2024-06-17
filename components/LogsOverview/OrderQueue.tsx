import useRecords from "@/hooks/useRecords";
import React from "react";

function OrderQueue() {
  const { error, isLoading, records } = useRecords();
  return (
    <table className="overflow-y-scroll">
      <thead>
        <tr>
          <th className="border border-black border-y-transparent">Order Id</th>
          <th className="border border-black border-y-transparent">
            Costumer Name
          </th>
          <th className="border border-black border-y-transparent">
            Order Date
          </th>
          {/* <th className="border border-black border-y-transparent">Status</th> */}
          <th className="border border-black border-y-transparent">
            Total Items
          </th>
          <th className="border border-black border-y-transparent">
            Total Quantity
          </th>
          <th className="border border-black border-y-transparent">
            Total Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(records) &&
          records.map((record) => {
            return (
              <tr key={record.id} className="text-center text-[10px] font-bold">
                <td>{record.id}</td>
                <td>{record.clientName}</td>
                <td>{String(record.dateCreated)}</td>
                {/* <td>{record.trucks.status}</td> */}
                <td>{record._count.orderedProductsTest}</td>
                <td>
                  {record.orderedProductsTest.reduce((acc, initial) => {
                    return (
                      acc +
                      initial.binLocations.reduce((acc, initial) => {
                        return acc + initial.quantity;
                      }, 0)
                    );
                  }, 0)}
                </td>
                <td>
                  ₱
                  {record.orderedProductsTest
                    .reduce((acc, initial) => {
                      return (
                        acc +
                        initial.binLocations.reduce((acc, initial) => {
                          const totalPrice =
                            initial.stockKeepingUnit?.products.price *
                            initial.quantity;
                          return acc + totalPrice;
                        }, 0)
                      );
                    }, 0)
                    .toLocaleString()}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

export default OrderQueue;
