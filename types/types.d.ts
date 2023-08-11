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
  category: string;
  image: string;
  price: number;
  productName: string;
  sku: string;
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
  id: string; // _id
  name: string;
  isAvailable: boolean;
  categoriesId: string;
  bin: Bin[];
}

interface Bin {
  id: string;
  isAvailable: boolean;
  capacity: number;
  shelfLevel: number;
  row: number;
  isSeleted: boolean;
  status: null;
  racksId: string;
  assignment: Assignment[];
}

interface Assignment {
  id: string;
  dateReceive: Date;
  purchaseOrder: string;
  expirationDate: Date;
  boxSize: string;
  isDamage: null;
  productId: string;
  binId: string;
  usersId: null;
  damageBinId: null;
  products: Product[];
}

export { Product, ProductList, Count, InputType, Racks, Bin, Assignment };
