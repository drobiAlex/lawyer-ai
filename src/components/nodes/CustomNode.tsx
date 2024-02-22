import {memo} from "react";
import {Handle, NodeProps, Position} from "reactflow";

export type NodeData = {
  label: string;
};


function CustomNode({id, data}: NodeProps<NodeData>) {
  return (
    <>
      <div className="px-4 py-2 shadow-md rounded-md border-2 border-stone-400 bg-teal-200">
        <div className="flex">
          <input defaultValue={data.label}/>
          <Handle type="target" position={Position.Top}/>
          <Handle type="source" position={Position.Bottom}/>
        </div>
      </div>
    </>
  );
}

export default memo(CustomNode);