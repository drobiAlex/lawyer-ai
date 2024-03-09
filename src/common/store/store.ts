import axios from "axios";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "reactflow";
import { create } from "zustand";

import { getEndpoint, reqConfig } from "@/lib/http";

// eslint-disable-next-line no-unused-vars
export type addNodeType = (node: Node) => void;
// eslint-disable-next-line no-unused-vars
type setSelectedNodeType = (nodeId: string | null) => void;

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  nodeTypes: any;
  edgeTypes: any;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: addNodeType;
  onConnect: OnConnect;
  fetchContainers: () => void;
  setSelectedNode: setSelectedNodeType;
};

const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  nodeTypes: {},
  edgeTypes: {},
  selectedNode: null,
  onNodesChange: (nodeChanges: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(nodeChanges, get().nodes),
    });
  },
  onEdgesChange: (edgeChanges: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(edgeChanges, get().edges),
    });
  },
  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  fetchContainers: async () => {
    const response = await axios.get(getEndpoint("jurisdictions"), reqConfig());
  },
  setSelectedNode: (nodeId) => {
    if (!nodeId) {
      set({
        selectedNode: null,
      });
      return;
    } else {
      set({ selectedNode: get().nodes.find((n) => n.id === nodeId) });
    }
  },
}));

export default useStore;
