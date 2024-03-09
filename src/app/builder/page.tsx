"use client";

import "reactflow/dist/base.css";
import "../../../tailwind.config";

import { UserButton } from "@clerk/nextjs";
import React, { useRef, useState } from "react";
import { ReactFlowProvider } from "reactflow";

import { Sidebar } from "@/components/flow/Sidebar";
import StructureCanvas from "@/components/flow/StructureCanvas";
import TopToolbar from "@/components/toolbars/TopToolbar";

const toolbarHeight = 16;

function Builder() {
  const [isFloatingWindowOpen, setIsFloatingWindowOpen] = useState(true);
  const reactFlowWrapper = useRef(null);

  const toggleFloatingWindow = () => {
    setIsFloatingWindowOpen((prevState) => !prevState);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 flex-row">
        <TopToolbar height={toolbarHeight}>
          <div>Opti.law</div>
          <UserButton afterSignOutUrl="" />
        </TopToolbar>
      </div>
      <div>
        {/* Full-screen element */}
        <div
          className={`w-full h-full absolute top-16`}
          ref={reactFlowWrapper}
          style={{ height: `calc(100% - ${4}rem)` }}
        >
          <ReactFlowProvider>
            <StructureCanvas />
          </ReactFlowProvider>
        </div>
        {/* Floating window element */}
        {isFloatingWindowOpen && (
          <div className="fixed left-0 top-1/4 -translate-y-16 bg-white p-4 rounded-xl shadow-xl">
            <Sidebar />
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={toggleFloatingWindow}
            >
              Hide toolbar
            </button>
          </div>
        )}
        {/* Floating window toggle button */}
        {!isFloatingWindowOpen && (
          <button
            className="fixed transform rotate-90 top-1/2 left-0 -translate-x-12 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
            onClick={toggleFloatingWindow}
          >
            Open toolbar
          </button>
        )}
      </div>
    </div>
  );
}

export default Builder;
