import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection, Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "reactflow"
import {create} from 'zustand'

// eslint-disable-next-line no-unused-vars
export type addNodeType = (node: Node) => void;

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: addNodeType;
  onConnect: OnConnect;
}

const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: 'root',
      type: 'custom',
      data: {label: 'React Flow Mind Map'},
      position: {x: 0, y: 0},
    },
  ],
  edges: [],
  onNodesChange: (nodeChanges: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(nodeChanges, get().nodes)
    })
  },
  onEdgesChange: (edgeChanges: EdgeChange[]) => {
    console.log('edgeChanges', edgeChanges)
    set({
      edges: applyEdgeChanges(edgeChanges, get().edges)
    })
  },
  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node]
    })
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges)
    })
  }
}));

export default useStore;