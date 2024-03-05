import { Handle, NodeProps, Position } from "reactflow";
import { memo } from "react";
import IndividualOwnerIcon from "@/components/icons/IndividualOwnerIcon";
import ThreeVerticalDotsIcon from "@/components/icons/ThreeVerticalDotsIcon";
import { NodeData } from "@/app/builder/types";

function IndividualOwnerNode({ id, data }: NodeProps<NodeData>) {
  return (
    <div className="px-6 py-4 rounded-md border bg-white border-stone-400">
      <div className="flex flex-row w-full items-center justify-between">
        <div className="mr-4">
          <IndividualOwnerIcon />
        </div>
        <div className="flex-1 flex-col">
          <input defaultValue={data.label} />
          <h1> Type </h1>
        </div>
        <div className="flex flex-col justify-end">
          <ThreeVerticalDotsIcon />
        </div>
      </div>
      {!data.isPreview && <Handle type="source" position={Position.Bottom} />}
    </div>
  );
}

export default memo(IndividualOwnerNode);
