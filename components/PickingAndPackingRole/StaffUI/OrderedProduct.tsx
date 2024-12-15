import {
  TOrderedProductsWBinLocations,
  TRecords,
} from "../PickingAndPackingType";

type OrderedProductProps = {
  record: TRecords;
  orderedProduct: TOrderedProductsWBinLocations;
};

export default function OrderedProduct({
  orderedProduct,
  record,
}: OrderedProductProps) {
  return (
    <>
      {orderedProduct.binLocations?.map((binLocation, key) => {
        return (
          <div
            key={key}
            className="flex h-[4em] w-full flex-none select-none  flex-col items-center justify-center rounded-md bg-white p-2 shadow-md hover:bg-sky-300 md:w-[45em]"
          >
            <div className="flex gap-2">
              <h1>Product Name: {orderedProduct.productName}</h1>
              <h1>SKU: {binLocation.skuCode}</h1>
              <h1>Weight: {binLocation.stockKeepingUnit.weight}</h1>
              <h2>ID: {binLocation.id}</h2>
              <h1>Quantity: {binLocation.quantity}</h1>
            </div>

            {/* <h1 className="flex gap-2">
              {binLocation.assignedProducts.map((v) => (
                <div className="">{v.id}</div>
              ))}
            </h1> */}
          </div>
        );
      })}
    </>
  );
}
