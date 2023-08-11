import React from "react";
import { Product } from "@/types/types";
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

interface BinsProps {
  bins: Bin[];
}

function BinsLayout({ bins }: BinsProps) {
  return (
    <div className="flex flex-col">
      {bins.map((bin: Bin) => {
        return <button key={bin?.id}>{bin?.capacity}</button>;
      })}
    </div>
  );
}

export default BinsLayout;
