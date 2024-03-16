"use client";

// @flow
import * as React from "react";
import { uniqueId } from "@/lib/utils";
import { systemSupportedNodes } from "@/components/supported_nodes";
import { precisionPrefix } from "d3-format";
import { TBaseNodeData } from "@/components/nodes/types";
import { undefined } from "zod";

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const nodeData: TBaseNodeData = {
    label: "1",
    residence: "USA",
    isPreview: true,
    IconComponent: <div />,
    onConfigIconClick: () => {},
    onDeleteIconClick: () => {},
    nodeConfiguration: null,
    nodeTemporaryConfiguration: null,
  };
  const nodeProps = {
    id: uniqueId(),
    type: "",
    data: nodeData,
    selected: false,
    isConnectable: false,
    dragging: false,
    xPos: 0,
    yPos: 0,
    zIndex: 0,
  };

  return (
    <div className="pt-3 flex flex-col gap-4">
      {Array.from(Object.entries(systemSupportedNodes)).map(
        ([nodeType, NodeClass], index) => {
          const data = {
            ...nodeProps.data,
            label: "Node name",
          };
          const props = {
            ...nodeProps,
            type: nodeType,
            data: data,
          };
          return (
            <div
              key={index}
              draggable
              onDragStart={(event) => onDragStart(event, nodeType)}
            >
              <NodeClass {...props} />
            </div>
          );
        },
      )}
    </div>
  );
}
