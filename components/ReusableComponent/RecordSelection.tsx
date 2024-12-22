import {
  TBinLocations,
  TOrderedProductsWBinLocations,
  TRecords,
  TTrucks,
} from "../PickingAndPackingRole/PickingAndPackingType";
import { TToast } from "../PickingAndPackingRole/Toast";
import { ReportDamageProduct } from "../PickingAndPackingRole/StaffUI/RecordsView";
import OrderedProduct from "../PickingAndPackingRole/StaffUI/OrderedProduct";
import { useMyContext } from "@/contexts/AuthenticationContext";
import { UserRole } from "@prisma/client";
type TRecordSelectionProps = {
  data: TData;
  states: States;
};

type TData = {
  record: TRecords;
  truck: TTrucks;
  setToast?: React.Dispatch<React.SetStateAction<TToast>>;
};

type States = {
  reportDamageForm: ReportDamageProduct;
  setReportDamageForm: React.Dispatch<
    React.SetStateAction<ReportDamageProduct>
  >;
};

export default function RecordSelection({ data }: TRecordSelectionProps) {
  const { record } = data;
  return (
    <>
      <div className="flex items-center justify-between gap-[.5px] border border-dotted border-red-600 p-2 uppercase">
        <ul className="text-lg">
          Sales Order: {record.SO} (batch {record.batchNumber})
        </ul>
        <div className="flex  items-center justify-center gap-2">
          <ul>Destination: {record.locationName}</ul>
          <ul>Client: {record.clientName}</ul>
        </div>
      </div>
      <div className="h-72 gap-2 overflow-y-scroll border border-black bg-slate-600 p-2">
        <h1 className="sticky top-0 text-end uppercase text-black">
          Ordered Products
        </h1>

        <div className="flex flex-none flex-col gap-2 rounded border  border-white p-2">
          {record.orderedProducts.map((orderedProduct) => (
            <div key={orderedProduct.id}>
              <>{orderedProduct.productName}</>
              <div className="flex flex-col gap-2">
                {orderedProduct.binLocations.map((bl, key) => {
                  return (
                    <div
                      key={bl.id}
                      className="flex h-[4em] w-full flex-none select-none  flex-col items-center justify-center rounded-md bg-white shadow-md"
                    >
                      <BinLocView bl={bl} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0"></div>
      </div>
    </>
  );
}

interface BinLocViewProps {
  bl: TBinLocations;
}

function BinLocView({ bl }: BinLocViewProps) {
  const { globalState } = useMyContext();
  const role: UserRole | undefined = globalState?.verifiedToken?.roles;
  const goods = Array.isArray(bl.assignedProducts)
    ? bl.assignedProducts.filter((ap) => ap.quality === "Good").length
    : 0;

  const damages = Array.isArray(bl.assignedProducts)
    ? bl.assignedProducts.filter((ap) => ap.quality === "Damage").length
    : 0;

  return (
    <div className="flex h-full w-full flex-grow">
      <div className="flex h-full flex-grow items-center justify-center  gap-2 rounded-l-md bg-green-600">
        <h1>SKU: {bl.skuCode}</h1>
        <h1>Weight: {bl.stockKeepingUnit.weight}</h1>
        <h1 className="">Good: {goods}</h1>
      </div>
      {role === "Driver" && (
        <div className="flex h-full flex-grow items-center justify-center gap-2 rounded-r-md bg-red-400">
          <h1>SKU: {bl.skuCode}</h1>
          <h1>Weight: {bl.stockKeepingUnit.weight}</h1>
          <h1>Damaged: {damages}</h1>
        </div>
      )}
    </div>
  );
}
