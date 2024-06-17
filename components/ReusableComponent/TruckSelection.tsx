import Loading from "@/components/Parts/Loading";
import useTrucks from "@/hooks/useTrucks";
import RecordsView from "../PickingAndPackingRole/StaffUI/RecordsView";
import UpdateTruckStatus from "../PickingAndPackingRole/StaffUI/UpdateTruckStatus";
import { useMyContext } from "@/contexts/AuthenticationContext";
import EmergencyStopButton from "../PickingAndPackingRole/StaffUI/EmergencyStopButton";
import GasStopButton from "../PickingAndPackingRole/StaffUI/GasStopButton";
import TruckDetails from "./TruckDetails";
import Toast, { TToast } from "../PickingAndPackingRole/Toast";
import { SetStateAction, useEffect, useState } from "react";
import { Coordinates } from "@prisma/client";

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
  const id: string | undefined = globalState?.verifiedToken?.id;
  const { selectedId, setSelectedId } = states;
  const [toast, setToast] = useState<TToast>({
    animate: "animate-fade",
    door: false,
    message: "",
  });
  const { trucks } = useTrucks();

  function selectId(truckId: string) {
    selectedId?.includes(truckId)
      ? setSelectedId(selectedId.filter((i) => i !== truckId))
      : setSelectedId([...selectedId, truckId]);
  }

  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    // FOR TRACKING LOCATION
    console.log("geolocation is working");
    if (role === "Driver") {
      if (navigator.geolocation) {
        console.log(true);
        const successHandler = (position: GeolocationPosition) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        };

        const errorHandler = (error: GeolocationPositionError) => {
          // setError(error.message);
          console.log(error);
        };

        const options = {
          enableHighAccuracy: true,
          timeout: 5000,
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
    }
  }, [role]);

  return (
    <>
      {Array.isArray(trucks) ? (
        trucks?.map((truck) => {
          return (
            <div key={truck.id}>
              <div
                className="flex h-full w-full select-none flex-col items-center justify-between gap-2 rounded-md bg-slate-500/20 p-[.5px] px-2 py-1 shadow-sm transition-all md:flex-row md:hover:bg-slate-500 md:hover:text-white"
                onClick={() => selectId(truck.id)}
              >
                <div className="flex max-h-full max-w-[30em] gap-2 break-words  text-[12px]">
                  <TruckDetails truck={truck} />
                </div>
                {role === "Driver" && (
                  <div className="flex w-[23.2em] items-center justify-start gap-2 transition-all">
                    <GasStopButton
                      truck={truck}
                      states={{ setToast, coordinates }}
                    />
                    <EmergencyStopButton
                      truck={truck}
                      states={{ setToast, coordinates }}
                    />
                    <UpdateTruckStatus
                      truck={truck}
                      states={{ setToast, coordinates }}
                    />

                    {/* currently WORK IN
                    PROGRESS 


                    the start deliver must have a prompt to the user if the orders has been delivered

                    prompt the use if the product hasnt been delivered
                    the button complete cant be change if all the products hasnt been delivered
                  the button complete must have a prompt and a restiction if the one or more of the products has been completely delivered


                    if the driver has been in emergency stop then make a external comps to the admin so they can change the truck status

                    EMEGERGENCY AND GAS STOP MUST HAVE A LOCATION IN THE LOGS TO PINPOINT WHERE ARE THEY




                    the driver is the only one who can alter the prouuct status its handles


                    the truck logs must have time stamp nad optional location
                    
                    */}
                  </div>
                )}
                <div>({truck.records.length})</div>
              </div>
              <div className="flex items-center justify-center">
                <RecordsView
                  selectedId={selectedId}
                  truck={truck}
                  setToast={setToast}
                />
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex h-full w-full items-center justify-center border border-black">
          <Loading />
        </div>
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

/* 
  beofre set the truck status to be delivered, check first the products inside if all of those are delivered
  every product that has been delivered has a logs records so the it can be track the info later
  

*/
