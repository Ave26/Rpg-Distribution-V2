import React, { ReactNode } from "react";

function SubLayout({ children }: { children: ReactNode }) {
  return <div className="h-full w-full">{children}</div>;
}

export default SubLayout;
