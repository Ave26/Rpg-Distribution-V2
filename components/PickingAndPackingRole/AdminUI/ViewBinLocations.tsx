import React from "react";
import { TBinLocation, TBinLocations, TCreateOrderedProduct } from "./Admin";

type ViewBinLocationsProps = {
  binLocations: TBinLocations[];
  orderedProducts: TCreateOrderedProduct[];
};

function ViewBinLocations({
  binLocations,
  orderedProducts,
}: ViewBinLocationsProps) {
  return (
    <div className="flex w-fit flex-col">
      {Array.isArray(orderedProducts) ? (
        orderedProducts.map((orderedProduct, index) => {
          return (
            <div
              key={index}
              className="flex w-[35em]  flex-col gap-2 border border-black p-2 text-xs transition-all"
            >
              <p>{orderedProduct.productName}</p>
              {orderedProduct.binLocations.createMany.data.map(
                (binLocation, index) => {
                  return (
                    <div key={index}>
                      <h1>Bin ID: {binLocation.binId}</h1>
                      <h1>Quantity: {binLocation.quantity}</h1>
                      <h1>SKU Code: {binLocation.skuCode}</h1>
                    </div>
                  );
                }
              )}
            </div>
          );
        })
      ) : (
        <>currently dont have record</>
      )}
    </div>
  );
}

export default ViewBinLocations;
