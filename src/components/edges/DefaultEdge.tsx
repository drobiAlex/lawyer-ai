import React, { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "reactflow";
import { TBaseEdgeData } from "@/components/nodes/types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IndividualOwnerEdgeForm } from "@/components/node-forms/individual-owner-form";
import { Edit, XCircle } from "react-feather";
import { COLORS } from "@/components/colors/colors";

export function DefaultEdgeActions({
  onEdgeClick,
  onEdgeConfigClick,
}: {
  onEdgeClick: () => void;
  onEdgeConfigClick: () => void;
}) {
  return (
    <div className="flex justify-center items-center">
      <div
        onClick={onEdgeClick}
        className="flex justify-center items-center w-8 h-8 p-0.5 bg-gray-200 border border-white cursor-pointer rounded-full text-md leading-none hover:bg-red-200"
        style={{ color: COLORS.GREY }}
      >
        <XCircle />
      </div>
      <SheetTrigger asChild>
        <div
          onClick={onEdgeConfigClick}
          className="flex justify-center items-center w-8 h-8 p-1 bg-gray-200 border border-white cursor-pointer rounded-full text-md leading-none hover:bg-green-200"
          style={{ color: COLORS.GREY }}
        >
          <Edit />
        </div>
      </SheetTrigger>
    </div>
  );
}

function DefaultEdge({
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
}: EdgeProps<TBaseEdgeData>) {
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
        <Sheet>
          <SheetContent className="sm:max-w-none sm:max-w-xl">
            <IndividualOwnerEdgeForm />
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
            <DefaultEdgeActions
              onEdgeClick={onEdgeClick}
              onEdgeConfigClick={onEdgeConfigClick}
            />
          </div>
        </Sheet>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(DefaultEdge);
