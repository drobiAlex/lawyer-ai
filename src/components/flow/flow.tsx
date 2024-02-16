import {useRef} from "react";

import ReactFlow, {Connection, Controls, Edge, EdgeChange, MiniMap, NodeChange} from "reactflow";

import {initialEdgeses} from "@/app/builder/data";

type FlowProps = {
  edges?: Edge[]
  onNodeChange?: (changes: NodeChange[]) => void
  onEdgesChange?: (edges: EdgeChange[]) => void
  onConnect?: (connection: Connection) => void
}

const Flow = ({edges: initialEdges = []}: FlowProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null)
  return (
    <div className="react-flow-wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        // nodes={nodes}
        // edges={edges}
        // onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        // nodeTypes={nodeTypes}
        // onDragOver={onDragOver}
        // onDrop={onDrop}
        // onInit={setReactFlowInstance}
        // onNodeDoubleClick={handleNodeDoubleClick}
      >
        <MiniMap/>
        <Controls/>
      </ReactFlow>
    </div>
  )
}