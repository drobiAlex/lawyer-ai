import 'reactflow/dist/style.css';

import React, {useCallback, useEffect, useState} from "react";
import ReactFlow, {Controls, NodeOrigin} from "reactflow";
import {ReactFlowInstance} from "reactflow";
import {shallow} from "zustand/shallow";

import useStore, {RFState} from "@/common/store/store";
import CustomEdge from "@/components/edges/CustomEdge";
import CustomNode from "@/components/nodes/CustomNode";
import {useGetData} from "@/lib/http";


const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addNode: state.addNode,
  onConnect: state.onConnect
})
const nodeOrigin: NodeOrigin = [0, 0];

const nodeTypes = {
  custom: CustomNode
}
const edgeTypes = {
  custom: CustomEdge
}

function StructureCanvas() {

  const {nodes, edges, onNodesChange, onEdgesChange, addNode, onConnect} = useStore(
    selector,
    shallow
  );
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<'NodeData', 'EdgeData'>>();


  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');

    if (typeof type === 'undefined' || !type) {
      return;
    }

    if (!reactFlowInstance) {
      return;
    }

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    });

    addNode({
      id: Math.random().toString(),
      type: "custom",
      position,
      data: {label: `${type} node`}
    });

  }, [reactFlowInstance]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onConnect={onConnect}
      nodeOrigin={nodeOrigin}
      onInit={setReactFlowInstance}
      onDragOver={onDragOver}
      onDrop={onDrop}
      fitView
    >
      <Controls showInteractive={false}/>
    </ReactFlow>
  );
}

export default StructureCanvas;