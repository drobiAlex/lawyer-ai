import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "reactflow";

function CustomEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY } = props;
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    curvature: 0.25,
  });

  return (
    <>
      <BaseEdge path={edgePath} {...props} />
      <EdgeLabelRenderer>
        <button
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onClick={() => {
            setEdges((es) => es.filter((e) => e.id !== props.id));
          }}
        >
          delete
        </button>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(CustomEdge);
