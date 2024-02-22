import React from "react";
import {ReactFlowProvider} from "reactflow";

export function Providers({children}: { children: React.ReactNode }) {
  return (
      <ReactFlowProvider>
        {children}
      </ReactFlowProvider>
  )
}