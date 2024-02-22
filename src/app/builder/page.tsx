'use client'

import 'reactflow/dist/base.css';
import '../../../tailwind.config';

import React, {useRef} from "react";

import {Providers} from "@/common/providers/providers";
import {Sidebar} from "@/components/flow/Sidebar";
import StructureCanvas from "@/components/flow/StructureCanvas";

function Builder() {
  const reactFlowWrapper = useRef(null);
  return (
    <div className='flex h-full'>
      <Providers>
        <div className="flex w-full max-h-screen" ref={reactFlowWrapper}>
          <div className="flex-[4]">
            {/* structure canvas */}
            <StructureCanvas/>
          </div>
          <div className='flex-[1] ml-2 border-gray-200'>
            {/* sidebar */}
            <Sidebar/>
          </div>
        </div>
      </Providers>
    </div>
  );
}

export default Builder