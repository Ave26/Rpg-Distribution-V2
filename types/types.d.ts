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

export { Product, ProductList, Count };
