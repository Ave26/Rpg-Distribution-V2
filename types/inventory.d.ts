export interface Category {
  id: string;
  category: string;
  capacity: number;
  racks: Racks[];
}

export interface Product {
  productName: string;
  category: string;
  sku: string;
  barcodeId: string;
  price: number;
  assignment: Assignment[];
}

export interface Rack {
  id: string;
  name: string;
  isAvailable: boolean;
  categoriesId: string;
  categories: Category;
  bin: Bin[];
}

export interface Assignment {
  id: string;
  dateReceive: string | Date | null;
  purchaseOrder: string;
  expirationDate: string | Date | null;
  boxSize: string;
  isDamage: boolean | null;
  productId: string;
  binId: string;
  usersId: string | null;
  damageBinId: string | null;
  products: Product;
}

export interface Bin {
  id: string;
  isAvailable: boolean;
  capacity: number;
  shelfLevel: number;
  row: number;
  isSeleted: boolean;
  status: string | null;
  racksId: string;
  racks: Rack;
  assignment: Assignment[];
  _count: {
    assignment: number;
  };
}

export { Bin };
