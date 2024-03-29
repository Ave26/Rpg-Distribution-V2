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

export interface assignedProducts {
  id: string;
  dateReceive: string | Date | null;
  purchaseOrder: string;
  expirationDate: string | Date | null;
  boxSize: string;
  isDamage: boolean | null;
  isMarked: boolean;
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
  isSelected: boolean;
  status: string | null;
  racksId: string;
  racks: Rack;
  assignedProducts: assignedProducts[];
  _count: {
    assignedProducts: number;
  };
}

export { Bin };
