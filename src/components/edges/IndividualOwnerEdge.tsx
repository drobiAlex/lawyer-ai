import React, { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  EdgeRemoveChange,
  getBezierPath,
  useReactFlow,
} from "reactflow";
import { shallow } from "zustand/shallow";
import useStore, { StoreStateActions } from "@/common/store/store";
import { TEdgeData } from "@/components/nodes/types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IndividualOwnerForm } from "@/components/node-forms/individual-owner-form";

function IndividualOwnerEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps<TEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { deleteElements } = useReactFlow();
  const onEdgeClick = () => {
    deleteElements({ edges: [{ id: id }] }); // remove edge
  };

  const onEdgeConfigClick = () => {
    data?.onConfigEdgeIconClick(id);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <Sheet
          onOpenChange={(open) => {
            console.log("open", open);
          }}
        >
          <SheetContent className="sm:max-w-none sm:max-w-xl">
            <IndividualOwnerForm />
          </SheetContent>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              // everything inside EdgeLabelRenderer has no pointer events by default
              // if you have an interactive element, set pointer-events: all
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <button
              onClick={onEdgeClick}
              className="w-8 h-8 bg-gray-200 border border-white cursor-pointer rounded-full text-md leading-none hover:bg-red-200"
            >
              x
            </button>
            <SheetTrigger asChild>
              <button
                onClick={onEdgeConfigClick}
                className="w-8 h-8 bg-gray-200 border border-white cursor-pointer rounded-full text-md leading-none hover:bg-green-300"
              >
                e
              </button>
            </SheetTrigger>
          </div>
        </Sheet>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(IndividualOwnerEdge);
