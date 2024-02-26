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
import axios from "axios";
import {reqConfig} from "@/lib/http";

// eslint-disable-next-line no-unused-vars
export type addNodeType = (node: Node) => void;

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: any;
  edgeTypes: any;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: addNodeType;
  onConnect: OnConnect;
  fetchContainers: () => void;
}

const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: 'root',
      type: 'individual_owner',
      data: {label: 'Individual Owner', residence: 'USA'},
      position: {x: 0, y: 0},
    },
  ],
  edges: [],
  nodeTypes: {},
  edgeTypes: {},
  onNodesChange: (nodeChanges: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(nodeChanges, get().nodes)
    })
  },
  onEdgesChange: (edgeChanges: EdgeChange[]) => {
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
  },

  fetchContainers: async () => {
    const requestConfig = reqConfig('GET', '/containers')
    const response = await axios(requestConfig);

  }
}));

export default useStore;