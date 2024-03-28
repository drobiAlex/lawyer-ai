"use client";

import "reactflow/dist/base.css";
import "../../../tailwind.config";

import { UserButton } from "@clerk/nextjs";
import React, { useRef, useState } from "react";
import { ReactFlowProvider } from "reactflow";

import Sidebar from "@/components/flow/Sidebar";
import StructureCanvas from "@/components/flow/StructureCanvas";
import TopToolbar from "@/components/toolbars/TopToolbar";

const toolbarHeight = 16;

function Builder() {
  const [isToolbarWindowOpen, setIsToolbarWindowOpen] = useState(true);
  const reactFlowWrapper = useRef(null);

  const toggleToolbarWindowOpen = () => {
    setIsToolbarWindowOpen((prevState) => !prevState);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 flex-row">
        <TopToolbar height={toolbarHeight}>
          <div className="select-none">Lawframe</div>
          <UserButton afterSignOutUrl="" />
        </TopToolbar>
      </div>
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
      {isToolbarWindowOpen ? (
        <div className="fixed left-0 top-1/4 -translate-y-16 ml-2 bg-white rounded-xl shadow-2xl">
          <h1 className="ps-4 pt-4 text-2xl select-none">Toolbox</h1>
          <div className="flex flex-col relative px-4 overflow-scroll">
            <div className="flex flex-1">
              <Sidebar />
            </div>
            {/* Vertical button */}
            <button
              className="fixed rotate-90 top-1/2 -right-24 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={toggleToolbarWindowOpen}
            >
              Hide Sidebar
            </button>
          </div>
        </div>
      ) : (
        <button
          className="fixed transform rotate-90 top-1/2 left-0 -translate-x-12 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
          onClick={toggleToolbarWindowOpen}
        >
          Open toolbar
        </button>
      )}
    </div>
  );
}

export default Builder;
