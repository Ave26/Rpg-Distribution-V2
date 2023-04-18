import React, { ReactNode, SetStateAction, useEffect, useState } from "react";

// export default function Toast({ data, show, setShow }: DataForToast) {
//   const [animate, setAnimate] = useState<boolean>(false);

//   // useEffect(() => {
//   //   const timeout = setTimeout(() => {
//   //     setShow((s: boolean) => {
//   //       return !s;
//   //     });
//   //   }, 2000);
//   //   return () => clearTimeout(timeout);
//   // }, [setShow, show]);

//   return (
//     <>
//       {show && (
//         <div
//           id="toast-bottom-left"
//           className="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow bottom-5 left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800"
//         >
//           <div className="text-sm font-semibold md:font-extrabold">{data}</div>
//         </div>
//       )}
//     </>
//   );
// }

interface DataForToast {
  data: ReactNode;
  show?: boolean;
}

export default function Toast({ data, show }: DataForToast) {
  return (
    <div className="fixed flex items-center w-fit max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow bottom-5 left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800">
      <p>{data}</p>
    </div>
  );
}
