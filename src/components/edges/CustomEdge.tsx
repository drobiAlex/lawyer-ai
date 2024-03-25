import { memo } from "react";
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

const onEdgeClick = (evt: any, id: any) => {
  evt.stopPropagation();
  alert(`remove ${id}`);
};

const selector = (state: StoreStateActions) => ({
  onEdgesChange: state.onEdgesChange,
});

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { onEdgesChange } = useStore(selector, shallow);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { setEdges, deleteElements } = useReactFlow();
  const onEdgeClick = () => {
    deleteElements({ edges: [{ id: id }] }); // remove edge
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
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
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(CustomEdge);
