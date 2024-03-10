import Loading from "@/components/Parts/Loading";
import useTrucks from "@/hooks/useTrucks";
import RecordsView from "../PickingAndPackingRole/StaffUI/RecordsView";
import UpdateTruckStatus from "../PickingAndPackingRole/StaffUI/UpdateTruckStatus";
import { useMyContext } from "@/contexts/AuthenticationContext";
import EmergencyStopButton from "../PickingAndPackingRole/StaffUI/EmergencyStopButton";
import GasStopButton from "../PickingAndPackingRole/StaffUI/GasStopButton";
import TruckDetails from "./TruckDetails";

type TTruckSelectionProps = {
  states: TStates;
};

type TStates = {
  selectedId: string[];
  setSelectedId: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TruckSelection({ states }: TTruckSelectionProps) {
  const { globalState } = useMyContext();
  const role: string | undefined = globalState?.verifiedToken?.roles;

  const { selectedId, setSelectedId } = states;
  const { trucks } = useTrucks();

  function selectId(truckId: string) {
    selectedId?.includes(truckId)
      ? setSelectedId(selectedId.filter((i) => i !== truckId))
      : setSelectedId([...selectedId, truckId]);
  }

  return (
    <>
      {Array.isArray(trucks) ? (
        trucks?.map((truck) => {
          return (
            <div key={truck.id}>
              <div
                className="flex h-full w-full flex-col items-center justify-between gap-2 rounded-sm border border-transparent border-b-slate-900 p-[.5px] transition-all hover:bg-slate-500 md:flex-row"
                onClick={() => selectId(truck.id)}
              >
                <div className="flex max-h-full max-w-[30em] gap-2 break-words  text-[12px]">
                  <TruckDetails truck={truck} />
                </div>
                {role === "Driver" && (
                  <div className="flex items-center justify-between gap-2 transition-all">
                    <GasStopButton />
                    <EmergencyStopButton />
                    <UpdateTruckStatus truck={truck} />
                  </div>
                )}
                <div>({truck.records.length})</div>
              </div>
              <div className="flex items-center justify-center border border-dotted border-x-slate-900 border-y-transparent">
                <RecordsView selectedId={selectedId} truck={truck} />
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex h-full w-full items-center justify-center border border-black">
          <Loading />
        </div>
      )}
    </>
  );
}
