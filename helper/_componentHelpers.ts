import { EntriesTypes } from "@/types/binEntries";
import { Bin } from "@/types/inventory";
import { assignedProducts, bins } from "@prisma/client";

type ToastTypes = {
  message: string;
  isShow: boolean;
};

type TSKU = {
  code: string;
};

type TAssignedProducts = {
  expirationDate: string;
  dateReceive: string;
  skuCode: string;
  sku: {
    weight: number;
  };
  products: {
    barcodeId: string;
    productName: string;
    sku: TSKU[];
    price: number;
  };
};

type TBins = bins & {
  assignedProducts: TAssignedProducts[];
  racks: {
    name: string;
    categories: {
      category: string;
    };
  };
  _count: {
    assignedProducts: number;
  };
};

export const getRequiredBinData = (bin: TBins, quantity: number) => {
  const productName = bin.assignedProducts[0]?.products.productName;
  const barcodeId = bin.assignedProducts[0]?.products.barcodeId;
  const expiryDate = bin.assignedProducts[0]?.expirationDate;
  const price = bin.assignedProducts[0]?.products.price;
  const skuCode = bin.assignedProducts[0]?.skuCode;
  const weight = bin.assignedProducts[0].sku.weight;
  const binId = bin.id;

  let newEntry: EntriesTypes = {
    totalQuantity: Number(quantity),
    productName,
    barcodeId,
    skuCode,
    weight,
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
  bins: TBins[],
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
