import axios from "axios";
import type { ICountry } from "countries-list";
import { countries } from "countries-list";
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

import { CompanyOrgForm, CompanyOrgFormType } from "@/common/store/api";
import { TBaseNodeData, TNodeConfiguration } from "@/components/nodes/types";
import { apiRequestConfig, getEndpoint } from "@/lib/http";

// eslint-disable-next-line no-unused-vars
export type addNodeType = (node: LawframeNodeType) => void;
// eslint-disable-next-line no-unused-vars
type setSelectedNodeType = (nodeId: string | null) => void;
// eslint-disable-next-line no-unused-vars
type deleteSelectedNodeType = (nodeId: string) => void;
type LawframeNodeType = Node & {
  data: TBaseNodeData;
};

export type StoreState = {
  nodes: LawframeNodeType[];
  edges: Edge[];
  selectedNode: Node | null;
  nodeTypes: any;
  edgeTypes: any;
  countries: ICountry[];
  supportedCountries: string[];
  companyOrgForms: CompanyOrgForm[];
  companyOrgFormsTypes: CompanyOrgFormType[];
};

export type Actions = {
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: addNodeType;
  onConnect: OnConnect;
  fetchContainersConfiguration: () => void;
  setSelectedNode: setSelectedNodeType;
  deleteSelectedNode: deleteSelectedNodeType;
  editSelectedNode: (label: string, type: string) => void;
  updateNodeConfiguration: (
    nodeId: string,
    configuration: TNodeConfiguration,
    temporaryConfiguration: boolean,
  ) => void;
};

// merge state and actions
export type StoreStateActions = StoreState & Actions;

const useStore = create<StoreState & Actions>((set, get) => ({
  nodes: [],
  edges: [],
  nodeTypes: {},
  edgeTypes: {},
  countries: [],
  supportedCountries: [],
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

  fetchContainersConfiguration: async () => {
    const typesReq = axios.get(
      getEndpoint("jurisdictions/company-org-forms-types/"),
      apiRequestConfig(),
    );
    const companyOrgFormsReq = axios.get(
      getEndpoint("jurisdictions/company-org-forms/"),
      apiRequestConfig(),
    );
    const supportedCountriesReq = axios.get(
      getEndpoint("jurisdictions/company-org-forms/"),
      apiRequestConfig(),
    );

    Promise.all([typesReq, companyOrgFormsReq, supportedCountriesReq])
      .then((response) => {
        const companyOrgFormsTypes: CompanyOrgFormType[] | null =
          response[0].data;
        const companyOrgForms: CompanyOrgForm[] | null = response[1].data;
        const supportedCountries: string[] | null = response[2].data;
        const countriesList: ICountry[] = Object.values(countries);
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
        if (supportedCountries) {
          set({
            supportedCountries: supportedCountries,
          });
        }
        set({
          countries: countriesList,
        });
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
  editSelectedNode: (label: string, type: string) => {
    const updatedNodes = get().nodes.map((node) => {
      if (node.id !== get().selectedNode?.id) return node;
      const updatedNodeData: TBaseNodeData = {
        ...node.data,
        label: label,
      };
      return {
        ...node,
        data: updatedNodeData,
      };
    });
    set({
      nodes: updatedNodes,
    });
  },
  updateNodeConfiguration: (
    nodeId: string,
    configuration: TNodeConfiguration,
    temporaryConfiguration: boolean,
  ) => {
    const updatedNodes = get().nodes.map((node) => {
      if (node.id !== nodeId) return node;
      let updatedNodeData: TBaseNodeData;

      if (temporaryConfiguration) {
        updatedNodeData = {
          ...node.data,
          nodeTemporaryConfiguration: configuration,
        };
      } else {
        updatedNodeData = {
          ...node.data,
          nodeConfiguration: configuration,
        };
      }
      return {
        ...node,
        data: updatedNodeData,
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
