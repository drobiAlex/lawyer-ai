import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection, OnConnect,
} from "reactflow"

import {create} from 'zustand'

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: (node: Node) => void;
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