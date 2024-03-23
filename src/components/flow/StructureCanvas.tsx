import "reactflow/dist/style.css";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  NodeOrigin,
  Panel,
  ReactFlowInstance,
  useReactFlow,
} from "reactflow";
import { shallow } from "zustand/shallow";

import useStore, {
  TLawframeNode,
  StoreStateActions,
} from "@/common/store/store";
import CustomEdge from "@/components/edges/CustomEdge";
import { systemSupportedNodes } from "@/components/supported_nodes";
import { DownloadButton } from "@/components/flow/DownloadButton";
import { TBaseNodeData } from "@/components/nodes/types";
import { undefined } from "zod";
import { randomName, uniqueId } from "@/lib/utils";

const selector = (state: StoreStateActions) => ({
  nodes: state.nodes,
  edges: state.edges,
  nodeConfig: state.selectedNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addNode: state.addNode,
  onConnect: state.onConnect,
  fetchContainersConfiguration: state.fetchContainersConfiguration,
  setSelectedNode: state.setSelectedNode,
  deleteSelectedNode: state.deleteSelectedNode,
});
const nodeOrigin: NodeOrigin = [0, 0];

const flowKey = "working-flow";

function StructureCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    onConnect,
    setSelectedNode,
    deleteSelectedNode,
    fetchContainersConfiguration,
  } = useStore(selector, shallow);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<"NodeData", "EdgeData">>();
  const { setViewport } = useReactFlow();

  function saveFlow() {
    if (!reactFlowInstance) {
      return;
    }
    const flow = reactFlowInstance.toObject();
    localStorage.setItem(flowKey, JSON.stringify(flow));
  }

  const onNodeChangeHandler = useCallback(
    (nodeChanges: any) => {
      onNodesChange(nodeChanges);
      saveFlow();
    },
    [nodes],
  );

  const onEdgesChangeHandler = useCallback(
    (edgeChanges: any) => {
      onEdgesChange(edgeChanges);
      saveFlow();
    },
    [edges],
  );

  useEffect(() => {
    const restoreFlow = async () => {
      const flowStorage = localStorage.getItem(flowKey);
      if (!flowStorage) {
        return;
      }
      const flow = JSON.parse(flowStorage);
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        flow.nodes.forEach((node: TLawframeNode) => {
          const restoredNode = {
            ...node,
            data: {
              onConfigIconClick: setSelectedNode,
              onDeleteIconClick: deleteSelectedNode,
              ...node.data,
            },
          };
          addNode(restoredNode);
        });
        flow.edges.forEach((edge: Edge) => {
          onConnect({ source: edge.source, target: edge.target } as Connection);
        });
        setViewport({ x, y, zoom });
      }
    };
    restoreFlow().then();
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
      const baseNodeData: TBaseNodeData = {
        label: `${nodeLabel.charAt(0).toUpperCase()}${nodeLabel.slice(1)}`,
        onConfigIconClick: setSelectedNode,
        onDeleteIconClick: deleteSelectedNode,
        IconComponent: undefined,
        nodeConfiguration: null,
        nodeTemporaryConfiguration: null,
      };

      addNode({
        id: uniqueId(),
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
      onNodesChange={onNodeChangeHandler}
      onEdgesChange={onEdgesChangeHandler}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onConnect={onConnect}
      nodeOrigin={nodeOrigin}
      onInit={setReactFlowInstance}
      onDragOver={onDragOver}
      onDrop={onDrop}
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
