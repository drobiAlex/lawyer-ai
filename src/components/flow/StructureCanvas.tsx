import 'reactflow/dist/style.css';

import React, {useCallback, useMemo, useState} from "react";
import ReactFlow, {Background, Controls, NodeOrigin, ReactFlowInstance} from "reactflow";
import {shallow} from "zustand/shallow";

import useStore, {RFState} from "@/common/store/store";
import CustomEdge from "@/components/edges/CustomEdge";
import IndividualOwnerNode from "@/components/nodes/IndividualOwnerNode";
import MainCompanyNode from "@/components/nodes/MainCompanyNode";
import ClientCustomerNode from "@/components/nodes/ClientCustomerNode";
import ContractorsNode from "@/components/nodes/ContractorsNode";
import SubsidiaryCompanyNode from "@/components/nodes/SubsidiaryCompanyNode";
import UnrelatedCompanyNode from "@/components/nodes/UnrelatedCompanyNode";


const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addNode: state.addNode,
  onConnect: state.onConnect
})
const nodeOrigin: NodeOrigin = [0, 0];

function StructureCanvas() {

  const {nodes, edges, onNodesChange, onEdgesChange, addNode, onConnect} = useStore(
    selector,
    shallow
  );
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<'NodeData', 'EdgeData'>>();
  // const nodeTypes =
  const nodeTypes = useMemo(
    () => ({
      main_company: MainCompanyNode,
      individual_owner: IndividualOwnerNode,
      client_customer: ClientCustomerNode,
      contractor: ContractorsNode,
      subsidiary_company: SubsidiaryCompanyNode,
      unrelated_company: UnrelatedCompanyNode
    }),
    [],
  );
  const edgeTypes = useMemo(
    () => ({
      custom: CustomEdge,
    }),
    [],
  );

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
      type: "individual_owner",
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
      <Background color="#aaa" gap={32}/>
      <Controls showInteractive={false}/>
    </ReactFlow>
  );
}

export default StructureCanvas;