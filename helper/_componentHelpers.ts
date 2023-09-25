import { EntriesTypes } from "@/types/binEntries";
import { Bin } from "@/types/inventory";

type ToastTypes = {
  message: string;
  isShow: boolean;
};

export const getRequiredBinData = (bin: Bin, quantity: number) => {
  const productName = bin.assignedProducts[0]?.products.productName;
  const barcodeId = bin.assignedProducts[0]?.products.barcodeId;
  const expiryDate = bin.assignedProducts[0]?.expirationDate;
  const price = bin.assignedProducts[0]?.products.price;
  const sku = bin.assignedProducts[0]?.products.sku;
  const binId = bin.id;

  let newEntry: EntriesTypes = {
    totalQuantity: Number(quantity),
    productName,
    barcodeId,
    sku,
    expiryDate,
    price,
    binIdsEntries: [binId],
  };

  return {
    newEntry,
    binId,
  };
};

export const getProductTotalQuantity = (
  bins: Bin[],
  quantity: number,
  setToast: React.Dispatch<React.SetStateAction<ToastTypes>>
) => {
  let totalProductQuantity: number = 0;
  if (bins) {
    for (let i = 0; i < Number(bins?.length); i++) {
      const productCount = Number(bins[i]?._count.assignedProducts);
      totalProductQuantity += productCount;
    }
  }

  if (quantity > totalProductQuantity) {
    setToast({ isShow: true, message: "Action Denied" });
    return console.log("Requested Quantity Exceeded");
  }

  return totalProductQuantity;
};
