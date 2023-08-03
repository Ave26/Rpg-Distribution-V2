interface AdditionalInfo {
  Dob: Date;
  Phone_number: number;
  email: string;
}

interface Data extends AdditionalInfo {
  message?: string;
  id: number;
  username: string;
  roles?: string[];
}

export { type AdditionalInfo, type Data };

// ----------------------THIS IS FOR THE PRODUCT TYPES
interface Product {
  id: string;
  barcodeId: string;
  img: string;
  productName: string;
  productLists: ProductList[];
  _count: Count;
}

interface Count {
  productLists: number;
}

interface ProductList {
  id: string;
  quantity: null;
  dateRecieve: Date;
  expirationDate: string;
  price: number;
  sku: string;
  poId: string;
  status: string;
  paletteLocation: string;
  productType: string;
  userId: null;
  productDetailsId: string;
}

interface InputType {
  barcodeId: string;
  quantity: number;
  expiry?: Date;
}

interface Racks {
  _id: string;
  name: string;
  isAvailable: boolean;
  categoriesId: string;
  bin: Bin[];
}

interface Bin {
  _id: string;
  isAvailable: boolean;
  capacity: number;
  shelfLevel: number;
  row: number;
  racksId: string | null;
  assignment: Assignment[];
  _count?: {
    assignment: number;
  };
}
interface Assignment {
  _id: string;
  dateReceive: Date;
  purchaseOrder: string;
  expirationDate: Date;
  boxSize: string;
  productId: string;
  binId: string;
}

export { Product, ProductList, Count, InputType, Racks, Bin };
