'use client'

// @flow
import {Loader2} from 'lucide-react';
import * as React from 'react';
import MainCompanyNode from "@/components/nodes/MainCompanyNode";
import IndividualOwnerNode from "@/components/nodes/IndividualOwnerNode";
import ClientCustomerNode from "@/components/nodes/ClientCustomerNode";
import ContractorsNode from "@/components/nodes/ContractorsNode";
import SubsidiaryCompanyNode from "@/components/nodes/SubsidiaryCompanyNode";
import UnrelatedCompanyNode from "@/components/nodes/UnrelatedCompanyNode";

// const nodeTypes = [
//   MainCompanyNode,
//   IndividualOwnerNode,
//   ClientCustomerNode,
//   ContractorsNode,
//   SubsidiaryCompanyNode,
//   UnrelatedCompanyNode
// ];

export function Sidebar() {

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Example props to be passed to each node component
  // const commonProps = {
  //   id: '12',
  //   type: 'individual_owner',
  //   data: {label: '1', residence: 'USA', attributes: undefined, type: 'individual_owner'},
  //   dragHandle: '1',
  //   selected: false,
  //   isConnectable: false,
  //   dragging: false,
  //   xPos: 0,
  //   yPos: 0,
  //   zIndex: 0,
  // };


  return (
    <aside className="p-3">
      <div>Elements:</div>
      <div className="pt-3 flex flex-col gap-4">
        {/*{nodeTypes.map((NodiTypi, index) => (*/}
        {/*  <div key={index} draggable onDragStart={(event) => onDragStart(event, NodiTypi.name)}>*/}
        {/*    <NodiTypi {...commonProps} />*/}
        {/*  </div>*/}
        {/*))}*/}
      </div>
    </aside>
  );

  // return (
  //   <aside className="p-3">
  //     {false ? (
  //       <>
  //         <div className="top-1/2 left-1/2 translate-x-1/2 translate-y-1/2">
  //           <Loader2 className="w-10 h-10 text-blue-500 animate-spin">
  //             <p className='mt-2 text-sm text-slate-500'>Uploading...</p>
  //           </Loader2>
  //         </div>
  //       </>
  //     ) : (
  //       <>
  //         <div>Elements:</div>
  //         <div className="pt-3 flex flex-col gap-4">
  //           {nodeTypes.map(({ type, label, color }) => (
  //             <div
  //               key={type}
  //               className={`p-3 rounded-md border ${color}`}
  //               onDragStart={(event) => onDragStart(event, type)}
  //               draggable
  //             >
  //               {label}
  //             </div>
  //           ))}
  //         </div>
  //       </>
  //     )}
  //   </aside>
  // );
}
