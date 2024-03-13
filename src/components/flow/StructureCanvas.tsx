import "reactflow/dist/style.css";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  NodeOrigin,
  Panel,
  ReactFlowInstance,
} from "reactflow";
import { shallow } from "zustand/shallow";

import useStore, { StoreStateActions } from "@/common/store/store";
import CustomEdge from "@/components/edges/CustomEdge";
import { systemSupportedNodes } from "@/components/supported_nodes";
import { DownloadButton } from "@/components/flow/DownloadButton";
import { BaseNodeData } from "@/app/builder/types";
import { undefined } from "zod";
import { type } from "node:os";
import { randomName } from "@/lib/utils";

const selector = (state: StoreStateActions) => ({
  nodes: state.nodes,
  edges: state.edges,
  nodeConfig: state.selectedNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addNode: state.addNode,
  onConnect: state.onConnect,
  fetchContainers: state.fetchContainers,
  setSelectedNode: state.setSelectedNode,
  deleteSelectedNode: state.deleteSelectedNode,
});
const nodeOrigin: NodeOrigin = [0, 0];

function StructureCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    onConnect,
    fetchContainers,
    setSelectedNode,
    deleteSelectedNode,
  } = useStore(selector, shallow);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<"NodeData", "EdgeData">>();

  useEffect(() => {
    fetchContainers();
  }, []);
  const nodeTypes = useMemo(() => systemSupportedNodes, []);

  const edgeTypes = useMemo(
    () => ({
      custom: CustomEdge,
    }),
    [],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      if (!reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeLabel = randomName();
      const baseNodeData: BaseNodeData = {
        label: `${nodeLabel.charAt(0).toUpperCase()}${nodeLabel.slice(1)}`,
        onConfigIconClick: setSelectedNode,
        onDeleteIconClick: deleteSelectedNode,
        IconComponent: undefined,
      };

      addNode({
        id: Math.random().toString(),
        type: type,
        position,
        data: baseNodeData,
      });
    },
    [reactFlowInstance],
  );

  function onPaneClick() {
    setSelectedNode(null);
  }

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
      onPaneClick={onPaneClick}
      deleteKeyCode={null}
      fitView
    >
      <Background color="#aaa" gap={32} />
      <Controls showInteractive={false} position="bottom-right" />
      <Panel position="top-right">
        <DownloadButton />
      </Panel>
    </ReactFlow>
  );
}

export default StructureCanvas;
