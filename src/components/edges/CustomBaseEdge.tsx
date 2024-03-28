import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "reactflow";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TBaseEdgeData } from "@/components/edges/edges";
import { COLORS } from "@/components/colors/colors";
import { Edit, XCircle } from "react-feather";

export function CustomEdgeActions({
  onEdgeRemoveClick,
  onEdgeConfigClick,
}: {
  onEdgeRemoveClick: () => void;
  onEdgeConfigClick: () => void;
}) {
  return (
    <div className="flex justify-center items-center">
      <div
        onClick={onEdgeRemoveClick}
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

function CustomBaseEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerStart, // Marker (arrow) at the start of the edge
  markerEnd, // Marker (arrow) at the end of the edge
  style = {}, // Custom style for the edge
  children, // Children components to render inside the edge label
}: EdgeProps<TBaseEdgeData> & {
  children: React.ReactNode;
}) {
  // Additional props or state could be defined here if needed
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { deleteElements } = useReactFlow();

  const onEdgeRemoveClick = () => {
    deleteElements({ edges: [{ id: id }] }); // remove edge
  };

  const onEdgeConfigClick = () => {
    console.log("onEdgeConfigClick", id);
    data?.onEdgeConfigClick(id);
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerStart={markerStart}
        markerEnd={markerEnd}
        style={style}
      />
      <EdgeLabelRenderer>
        <Sheet
          onOpenChange={(open) => {
            if (!open) {
              data?.onEdgeConfigClick(null);
            }
          }}
        >
          <SheetContent className="sm:max-w-none sm:max-w-xl">
            {/* Here you can either use `IndividualOwnerEdgeForm` or any child component passed */}
            {children}
          </SheetContent>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            {/* Since CustomBaseEdge is meant to be more generic, you might want to make actions customizable as well */}
            <CustomEdgeActions
              onEdgeRemoveClick={onEdgeRemoveClick}
              onEdgeConfigClick={onEdgeConfigClick}
            />
          </div>
        </Sheet>
      </EdgeLabelRenderer>
    </>
  );
}

export default CustomBaseEdge;
