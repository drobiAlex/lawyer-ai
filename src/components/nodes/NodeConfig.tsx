import { Node } from "reactflow";

function NodeConfig({ node }: { node: Node }) {
  return (
    <div>
      <h1>Node Config: {node.id}</h1>
    </div>
  );
}

export default NodeConfig;
