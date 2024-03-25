"use client";

// @flow
import * as React from "react";
import { memo } from "react";
import { capitalizeNodeType, uniqueId } from "@/lib/utils";
import { systemSupportedNodes } from "@/components/supported_nodes";
import { TBaseNodeData } from "@/components/nodes/types";

function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const nodeData: TBaseNodeData = {
    randomName: "",
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
    <div className="py-4 flex flex-col gap-4">
      {Array.from(Object.entries(systemSupportedNodes)).map(
        ([previewNodeType, PreviewNodeClass], index) => {
          const data = {
            ...nodeProps.data,
            randomName: capitalizeNodeType(previewNodeType),
          };
          const props = {
            ...nodeProps,
            type: previewNodeType,
            data: data,
          };
          return (
            <div
              key={index}
              draggable
              onDragStart={(event) => onDragStart(event, previewNodeType)}
            >
              <PreviewNodeClass {...props} />
            </div>
          );
        },
      )}
    </div>
  );
}

export default memo(Sidebar);
