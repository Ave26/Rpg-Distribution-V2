import Loading from "@/components/Parts/Loading";
import useTrucks from "@/hooks/useTrucks";
import RecordsView from "../PickingAndPackingRole/StaffUI/RecordsView";
import UpdateTruckStatus, {
  TUpdateProductStatus,
} from "../PickingAndPackingRole/StaffUI/UpdateTruckStatus";
import { useMyContext } from "@/contexts/AuthenticationContext";
import EmergencyStopButton from "../PickingAndPackingRole/StaffUI/EmergencyStopButton";
import GasStopButton from "../PickingAndPackingRole/StaffUI/GasStopButton";
import TruckDetails from "./TruckDetails";
import Toast, { TToast } from "../PickingAndPackingRole/Toast";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { Coordinates } from "@prisma/client";
import { TTrucks } from "../PickingAndPackingRole/PickingAndPackingType";

type TTruckSelectionProps = {
  states: TStates;
};

type TStates = {
  selectedId: string;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
};

export default function TruckSelection({ states }: TTruckSelectionProps) {
  const { trucks } = useTrucks();
  const { selectedId, setSelectedId } = states;

  const [toast, setToast] = useState<TToast>({
    animate: "animate-fade",
    door: false,
    message: "",
  });

  return (
    <>
      {Array.isArray(trucks) ? (
        trucks.map((truck, key) => {
          return (
            <div key={key}>
              <SelectTruckId
                states={{ selectedId, setSelectedId, truck, setToast, toast }}
              />
              <div className="flex items-center justify-center">
                <RecordsView
                  truck={truck}
                  states={{ selectedId, setToast, toast }}
                />
              </div>
            </div>
          );
        })
      ) : (
        <Loading />
      )}
      <Toast
        states={{
          setToast,
          toast,
        }}
      />
    </>
  );
}

interface SelectTruckIdProps {
  states: {
    setSelectedId: React.Dispatch<React.SetStateAction<string>>;
    selectedId: string;
    truck: TTrucks;
    setToast: React.Dispatch<React.SetStateAction<TToast>>;
    toast: TToast;
  };
}

function SelectTruckId({ states }: SelectTruckIdProps) {
  const { selectedId, setSelectedId, truck, setToast, toast } = states;
  const { globalState } = useMyContext();
  const role: string | undefined = globalState?.verifiedToken?.role;

  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: 0,
    longitude: 0,
  });
  console.log(role);
  const [isGeolocationAvailable, setGeolocationAvailable] =
    useState<boolean>(true);

  useEffect(() => {
    if (navigator.geolocation && role === "DRIVER") {
      // geolocation
      const successHandler = (position: GeolocationPosition) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGeolocationAvailable(true); // Geolocation is available
      };

      const errorHandler = (error: GeolocationPositionError) => {
        // setError(error.message);
        setGeolocationAvailable(false);
        if (error.code === error.PERMISSION_DENIED) {
          console.error("Geolocation access blocked: Permission denied.");
          // alert("Geolocation access blocked: Permission denied");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          console.error("Geolocation access blocked: Position unavailable.");
          // alert("Geolocation access blocked: Position unavailable.");
        } else if (error.code === error.TIMEOUT) {
          console.error("Geolocation access blocked: Request timed out.");
          // alert("Geolocation access blocked: Request timed out.");
        } else {
          console.error("An unknown error occurred:", error.message);
          // alert(`An unknown error occurred:, ${error.message}`);
        }
      };

      const options = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      };

      // Get the initial position
      navigator.geolocation.getCurrentPosition(
        successHandler,
        errorHandler,
        options
      );

      const watcherId = navigator.geolocation.watchPosition(
        successHandler,
        errorHandler,
        options
      );
      return () => {
        navigator.geolocation.clearWatch(watcherId);
      };
    }
  }, [role]);

  return (
    <div
      key={truck.id}
      className="flex select-none flex-col items-center justify-between gap-2 rounded-md bg-slate-500/20 p-[.5px] px-2 py-1 shadow-sm transition-all md:flex-row md:hover:bg-slate-500 md:hover:text-white"
      onClick={() => {
        selectedId === truck.id ? setSelectedId("") : setSelectedId(truck.id);
      }}
    >
      <div className="flex max-h-full max-w-[30em] gap-2 break-words  text-[12px]">
        <TruckDetails truck={truck} />
      </div>
      {role === "DRIVER" && (
        <div className="flex w-[23.2em] items-center justify-start gap-2 transition-all">
          <GasStopButton
            truck={truck}
            states={{
              setToast,
              coordinates,
              disabled: !isGeolocationAvailable,
            }}
          />
          <EmergencyStopButton
            truck={truck}
            states={{
              setToast,
              coordinates,
              disabled: !isGeolocationAvailable,
            }}
          />
          <UpdateTruckStatus
            truck={truck}
            states={{
              setToast,
              coordinates,
              disabled: !isGeolocationAvailable,
            }}
          />
        </div>
      )}
      <div>({truck.records.length})</div>
    </div>
  );
}
