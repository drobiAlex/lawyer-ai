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
  NodeRemoveChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "reactflow";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

import { BaseNodeData } from "@/app/builder/types";
import { CompanyOrgForm, CompanyOrgFormType } from "@/common/store/api";
import { getEndpoint, reqConfig } from "@/lib/http";

// eslint-disable-next-line no-unused-vars
export type addNodeType = (node: LawframeNodeType) => void;
// eslint-disable-next-line no-unused-vars
type setSelectedNodeType = (nodeId: string | null) => void;
// eslint-disable-next-line no-unused-vars
type deleteSelectedNodeType = (nodeId: string) => void;
type LawframeNodeType = Node & {
  data: BaseNodeData;
};

export type StoreState = {
  nodes: LawframeNodeType[];
  edges: Edge[];
  selectedNode: Node | null;
  nodeTypes: any;
  edgeTypes: any;
  companyOrgForms: CompanyOrgForm[];
  companyOrgFormsTypes: CompanyOrgFormType[];
};

export type Actions = {
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: addNodeType;
  onConnect: OnConnect;
  fetchContainers: () => void;
  setSelectedNode: setSelectedNodeType;
  deleteSelectedNode: deleteSelectedNodeType;
  editSelectedNode: (label: string) => void;
};

// merge state and actions
export type StoreStateActions = StoreState & Actions;

const useStore = create<StoreState & Actions>((set, get) => ({
  nodes: [],
  edges: [],
  nodeTypes: {},
  edgeTypes: {},
  selectedNode: null,
  companyOrgForms: [],
  companyOrgFormsTypes: [],
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
    const typesReq = axios.get(
      getEndpoint("jurisdictions/company-org-forms-types/"),
      reqConfig(),
    );
    const companyOrgFormsReq = axios.get(
      getEndpoint("jurisdictions/company-org-forms/"),
      reqConfig(),
    );
    Promise.all([typesReq, companyOrgFormsReq])
      .then((response) => {
        const companyOrgFormsTypes: CompanyOrgFormType[] | null =
          response[0].data;
        const companyOrgForms: CompanyOrgForm[] | null = response[1].data;

        if (companyOrgFormsTypes) {
          set({
            companyOrgFormsTypes: companyOrgFormsTypes,
          });
        }
        if (companyOrgForms) {
          set({
            companyOrgForms: companyOrgForms,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
  deleteSelectedNode: (nodeId: string) => {
    const removeChange: NodeRemoveChange = { id: nodeId, type: "remove" };
    set({
      nodes: applyNodeChanges([removeChange], get().nodes),
    });
  },
  editSelectedNode: (label: string) => {
    const updatedNodes = get().nodes.map((node) => {
      if (node.id !== get().selectedNode?.id) return node;
      return {
        ...node,
        data: {
          ...node.data,
          label: label,
          isPreview: false,
        },
      };
    });
    set({
      nodes: updatedNodes,
    });
  },
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useStore);
}

export default useStore;
