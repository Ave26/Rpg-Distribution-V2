import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("@/components/ReusableComponent/Map/LeafletMap"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export default Map;
