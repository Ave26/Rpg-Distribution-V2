import Loading from "@/components/Parts/Loading";
import { buttonStyleSubmit } from "@/styles/style";
import React from "react";

type TLocationButtonSubmit = {
  states: TStates;
};

type TStates = {
  loading: boolean;
};

function LocationButtonSubmit({ states }: TLocationButtonSubmit) {
  const { loading } = states;
  return (
    <button className={buttonStyleSubmit} type="submit">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loading />
        </div>
      ) : (
        "Submit"
      )}
    </button>
  );
}

export default LocationButtonSubmit;
