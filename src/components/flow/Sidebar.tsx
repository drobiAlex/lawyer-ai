"use client";

// @flow
import * as React from "react";
import { uniqueId } from "@/lib/utils";
import { systemSupportedNodes } from "@/components/supported_nodes";
import { precisionPrefix } from "d3-format";

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const nodeProps = {
    id: uniqueId(),
    type: "",
    data: {
      label: "1",
      residence: "USA",
      attributes: undefined,
      type: "",
      isPreview: true,
      IconComponent: <div />,
      onConfigIconClick: () => {},
      onDeleteIconClick: () => {},
    },
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
            type: nodeType,
            label: nodeType,
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
