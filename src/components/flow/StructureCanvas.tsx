import "reactflow/dist/style.css";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  Panel,
  ReactFlowInstance,
  useOnViewportChange,
  useReactFlow,
  Viewport,
} from "reactflow";
import { shallow } from "zustand/shallow";

import useStore, {
  flowKey,
  StoreStateActions,
  TLawframeEdge,
  TLawframeNode,
} from "@/common/store/store";
import CustomEdge from "@/components/edges/IndividualOwnerEdge";
import { systemSupportedNodes } from "@/components/supported_nodes";
import { DownloadButton } from "@/components/flow/DownloadButton";
import { TBaseNodeData } from "@/components/nodes/types";
import { undefined } from "zod";
import { randomName, uniqueId } from "@/lib/utils";

const selector = (state: StoreStateActions) => ({
  nodes: state.nodes,
  edges: state.edges,
  nodeConfig: state.selectedNode,
  clearNodes: state.clearNodes,
  clearEdges: state.clearEdges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onViewPortChange: state.onViewPortChange,
  addNode: state.addNode,
  onConnect: state.onConnect,
  fetchContainersConfiguration: state.fetchContainersConfiguration,
  setSelectedNode: state.setSelectedNode,
  deleteSelectedNode: state.deleteSelectedNode,
  setSelectedEdge: state.setSelectedEdge,
});

function StructureCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    clearNodes,
    clearEdges,
    onViewPortChange,
    addNode,
    onConnect,
    setSelectedNode,
    setSelectedEdge,
    deleteSelectedNode,
    fetchContainersConfiguration,
  } = useStore(selector, shallow);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<"NodeData", "EdgeData">>();
  const { setViewport } = useReactFlow();

  useOnViewportChange({
    onEnd: (viewport: Viewport) => {
      if (reactFlowInstance) onViewPortChange(viewport);
    },
  });

  useEffect(() => {
    // TODO - Move this to the store actions
    const restoreFlow = async () => {
      const flowStorage = localStorage.getItem(flowKey);
      if (!flowStorage) {
        return;
      }
      const flow = JSON.parse(flowStorage);
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;

        // Clear nodes and edges
        clearNodes();
        clearEdges();

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
          edge.data = {
            onConfigEdgeIconClick: setSelectedEdge,
            ...edge.data,
          };
          onConnect(edge as TLawframeEdge);
          // onConnect({ source: edge.source, target: edge.target } as Connection);
        });
        setViewport({ x, y, zoom });
      }
    };
    restoreFlow();
    fetchContainersConfiguration();
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
        randomName: `${nodeLabel.charAt(0).toUpperCase()}${nodeLabel.slice(1)}`,
        onConfigIconClick: setSelectedNode,
        onDeleteIconClick: deleteSelectedNode,
        IconComponent: undefined,
        nodeConfiguration: null,
        nodeTempConfiguration: null,
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

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onConnect={onConnect}
      onInit={(onInitHandler) => {
        console.log("onInitHandler");
        setReactFlowInstance(onInitHandler);
      }}
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
