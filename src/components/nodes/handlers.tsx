import { Handle, Position } from "reactflow";
import React from "react";

const InOutHandlers = () => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

const OutHandler = () => {
  return <Handle type="source" position={Position.Bottom} />;
};

const InHandler = () => {
  return <Handle type="target" position={Position.Top} />;
};

type NodeHandlersType = {
  [key: string]: React.FC;
};

const nodeHandlersMap: NodeHandlersType = {
  main_company: InOutHandlers,
  individual_owner: OutHandler,
};

function NodeHandlers({ nodeType }: { nodeType: string }) {
  const NodeHandler = nodeHandlersMap[nodeType];
  if (!NodeHandler) {
    return <InOutHandlers />;
  }
  return <NodeHandler />;
}

export default NodeHandlers;
