import React, { useEffect, useState } from "react";

type TLocationFormUpdate = {
  states: TStates;
  locationId: string;
};

type TStates = {
  selectedLocation: string;
};

function LocationFormUpdate({ states, locationId }: TLocationFormUpdate) {
  const { selectedLocation } = states;

  return (
    <>
      <form
        className={`${
          selectedLocation === locationId ? "h-[20em]" : "h-0 border-none"
        } animation-emerge w-full overflow-hidden border border-black transition-all`}
      >
        {/* dont render it in the first place

              the transtion and animation must work after the render having true

              need to create state management for animation

    b          CLOSE | OPEN

              const door = {
                  OPEN:  ()=> execute first the boolean before animation,
                  CLOSE: ()=> execute first the animation before boolean
                }

            */}
      </form>
    </>
  );
}

export default LocationFormUpdate;
