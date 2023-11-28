interface EntriesTypes {
  totalQuantity: number;
  productName: string;
  barcodeId: string;
  expiryDate: date;
  skuCode: string;
  weight: number;
  price: number;
  binIdsEntries: string[];
}

// update
// type binIdsEntries = {
//   binId: "374573",
//   assignedProductIds: [y]
// }

type SetEntriesTypes = React.Dispatch<
  React.SetStateAction<EntriesTypes[] | null>
>;

type dataEntriesTypes = {
  productEntry: EntriesTypes[] | null;
  setProductEntry: React.Dispatch<React.SetStateAction<EntriesTypes[] | null>>;
};
export { EntriesTypes, SetEntriesTypes, dataEntriesTypes };
