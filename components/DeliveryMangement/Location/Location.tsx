import LocationForm from "./LocationForm";
import ViewLocations from "./ViewLocations";

export default function Location() {
  return (
    <div className="flex h-full w-full flex-col gap-2 transition-all md:flex-row">
      <LocationForm />
      <div className="flex h-full w-full flex-col items-start justify-start gap-2">
        <ViewLocations />
      </div>
    </div>
  );
}
