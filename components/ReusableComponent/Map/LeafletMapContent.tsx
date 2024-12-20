// components/LeafletMap.tsx
import dynamic from "next/dynamic";

// Dynamically import LeafletMapContent with SSR disabled
const LeafletMapContent = dynamic(() => import("./LeafletMapContent"), {
  ssr: false,
});

const LeafletMap = () => {
  return (
    <div>
      <LeafletMapContent />
    </div>
  );
};

export default LeafletMap;
