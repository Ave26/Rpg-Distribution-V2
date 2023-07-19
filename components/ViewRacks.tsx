// this is intended to keep track where the product will be placed in automatic Mode
import React, { useState } from "react";

function ViewRacks({ isOpenRack }: { isOpenRack: boolean }): JSX.Element {
  const [rackName, setRackName] = useState<string>("Rack Name");
  const [style, setStyle] = useState("");
  const array = [
    [6, 12, 18, 24, 30, 36],
    [5, 11, 17, 23, 29, 35],
    [4, 10, 16, 22, 28, 34],
    [3, 9, 15, 21, 27, 33],
    [2, 8, 14, 20, 26, 32],
    [1, 7, 13, 19, 25, 31],
  ];

  return (
    <div
      className={`h-full break-all rounded-lg bg-cyan-500 p-2 text-xs shadow-lg shadow-cyan-500/50 md:text-sm`}>
      <h1 className="text-white">{rackName}</h1>
      {array.map((row, rowIndex) => (
        <div className="grid grid-cols-6 gap-2 " key={rowIndex}>
          {row.map((item, colIndex) => (
            <div
              className="m-1 flex items-center justify-center rounded-sm bg-white p-2 shadow-lg"
              key={colIndex}>
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default ViewRacks;
