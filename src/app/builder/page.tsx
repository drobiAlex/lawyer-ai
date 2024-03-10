"use client";

import "reactflow/dist/base.css";
import "../../../tailwind.config";

import { UserButton } from "@clerk/nextjs";
import React, { useRef, useState } from "react";
import { ReactFlowProvider } from "reactflow";

import { Sidebar } from "@/components/flow/Sidebar";
import StructureCanvas from "@/components/flow/StructureCanvas";
import TopToolbar from "@/components/toolbars/TopToolbar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
        {isToolbarWindowOpen && (
          <div className="fixed left-0 top-1/4 -translate-y-16 bg-white overflow-scroll p-4 rounded-xl shadow-xl">
            <Sidebar />
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={toggleToolbarWindowOpen}
            >
              Hide toolbar
            </button>
          </div>
        )}
        {/* Floating window toggle button */}
        {!isToolbarWindowOpen && (
          <button
            className="fixed transform rotate-90 top-1/2 left-0 -translate-x-12 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
            onClick={toggleToolbarWindowOpen}
          >
            Open toolbar
          </button>
        )}
      </div>
    </div>
  );
}

export default Builder;
