interface EntriesTypes {
  totalQuantity: number;
  productName: string;
  barcodeId: string;
  expiryDate: date;
  sku: string;
  price: number;
  binIdsEntries: string[];
}

type SetEntriesTypes = React.Dispatch<
  React.SetStateAction<EntriesTypes[] | null>
>;

type dataEntriesTypes = {
  productEntry: EntriesTypes[] | null;
  setProductEntry: React.Dispatch<React.SetStateAction<EntriesTypes[] | null>>;
};
export { EntriesTypes, SetEntriesTypes, dataEntriesTypes };
