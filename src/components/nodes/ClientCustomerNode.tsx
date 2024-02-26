import {Handle, NodeProps, Position} from "reactflow";
import {memo} from "react";
import ThreeVerticalDotsIcon from "@/components/icons/ThreeVerticalDotsIcon";
import ClientsCustomersIcon from "@/components/icons/ClientsCustomersIcon";
import {NodeData} from "@/app/builder/types";


function ClientCustomerNode({id, data}: NodeProps<NodeData>) {
  return (
    <div className="px-6 py-4 rounded-md border bg-white border-stone-400">
      <div className="flex flex-row w-max items-center">
        <div className="mr-4">
          <ClientsCustomersIcon/>
        </div>
        <div className="flex-1 flex-col">
          <input defaultValue={data.label}/>
          <h1> Type </h1>
        </div>
        <div className="flex-1 flex-col">
          <ThreeVerticalDotsIcon/>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom}/>
    </div>
  )
}

export default memo(ClientCustomerNode);