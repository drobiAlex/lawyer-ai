import axios from "axios";
import {
  countries,
  getCountryCode,
  getEmojiFlag,
  ICountry,
  TCountryCode,
} from "countries-list";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  EdgeRemoveChange,
  Node,
  NodeChange,
  NodeRemoveChange,
  OnEdgesChange,
  OnNodesChange,
  Viewport,
} from "reactflow";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { undefined } from "zod";
import { create } from "zustand";

import { CompanyOrgForm, CompanyOrgFormType } from "@/common/store/api";
import { TBaseEdgeData } from "@/components/edges/edges";
import {
  TBaseNodeData,
  TIndividualOwnerConfiguration,
  TMainCompanyConfiguration,
} from "@/components/nodes/types";
import { apiRequestConfig, getEndpoint } from "@/lib/http";
import { uniqueId } from "@/lib/utils";

export const flowKey = "working-flow";

/* eslint-disable no-unused-vars */
export type addNodeType = (node: TLawframeNode) => void;
export type TLawframeNode = Node & {
  data: TBaseNodeData;
};
export type TLawframeEdge = Edge & {
  data: TBaseEdgeData;
};

export type CountryWithFlagEmoji = ICountry & { flag: string };
type setSelectedNodeType = (nodeId: string | null) => void;
type deleteSelectedNodeType = (nodeId: string) => void;
type onConnectType = (connection: Connection | TLawframeEdge) => void;

export type StoreState = {
  viewport: Viewport;
  nodes: TLawframeNode[];
  edges: Edge[];
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  nodeTypes: any;
  edgeTypes: any;
  countries: CountryWithFlagEmoji[];
  supportedCountries: string[];
  companyOrgForms: CompanyOrgForm[];
  companyOrgFormsTypes: CompanyOrgFormType[];
};

export type Actions = {
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: addNodeType;
  onConnect: onConnectType;
  fetchContainersConfiguration: () => void;
  setSelectedNode: setSelectedNodeType;
  deleteSelectedNode: deleteSelectedNodeType;
  setSelectedEdge: (edgeId: string | null) => void;
  updateNodeConfiguration: (
    nodeId: string,
    configuration: TMainCompanyConfiguration | TIndividualOwnerConfiguration,
    temporaryConfiguration: boolean,
  ) => void;
  updateEdgeConfiguration: (
    edgeId: string,
    configuration: any,
    temporaryConfiguration: boolean,
  ) => void;
  backup: () => void;
  deleteBackup: () => void;
  onViewPortChange: (viewport: Viewport) => void;
  clearNodes: () => void;
  clearEdges: () => void;
};

/* eslint-enable no-unused-vars */

// merge state and actions
export type StoreStateActions = StoreState & Actions;

const useStore = create<StoreState & Actions>((set, get) => ({
  viewport: { x: 0, y: 0, zoom: 1 },
  nodes: [],
  edges: [],
  nodeTypes: {},
  edgeTypes: {},
  countries: [],
  supportedCountries: [],
  selectedNode: null,
  selectedEdge: null,
  companyOrgForms: [],
  companyOrgFormsTypes: [],
  backup: () => {
    const flow = {
      edges: get().edges,
      nodes: get().nodes,
      viewport: get().viewport,
    };
    get().deleteBackup();
    localStorage.setItem(flowKey, JSON.stringify(flow));
  },
  clearNodes: () => {
    set({
      nodes: [],
    });
  },
  clearEdges: () => {
    set({
      edges: [],
    });
  },
  deleteBackup: () => {
    localStorage.removeItem(flowKey);
  },
  onViewPortChange: (viewport: Viewport) => {
    set({
      viewport: viewport,
    });
  },
  onNodesChange: (nodeChanges: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(nodeChanges, get().nodes),
    });
    // Save to local storage
    get().backup();
  },
  onEdgesChange: (edgeChanges: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(edgeChanges, get().edges),
    });
    // Save to local storage
    get().backup();
  },
  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
  onConnect: (params: TLawframeEdge | Connection) => {
    if ("data" in params) {
      const edgeData: TBaseEdgeData = {
        ...params.data,
        onEdgeConfigClick: get().setSelectedEdge,
      };
      const edge = {
        ...params,
        type: "individual_owner_edge",
        data: edgeData,
      };
      set({
        edges: addEdge(edge, get().edges),
      });
    } else {
      if (!params) return null;

      const edgeData: TBaseEdgeData = {
        edgeConfiguration: null,
        edgeTempConfiguration: null,
        onEdgeConfigClick: get().setSelectedEdge,
      };

      const edge: TLawframeEdge = {
        id: uniqueId(),
        data: edgeData,
        source: params.source!,
        target: params.target!,
        type: "custom_default",
      };
      set({
        edges: addEdge(edge, get().edges),
      });
    }

    // Save to local storage
    get().backup();
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
          countries: countriesList.map((country) => {
            return {
              ...country,
              flag: getEmojiFlag(getCountryCode(country.name) as TCountryCode),
            };
          }),
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
    } else {
      set({ selectedNode: get().nodes.find((n) => n.id === nodeId) });
    }
  },
  deleteSelectedNode: (nodeId: string) => {
    const removeChange: NodeRemoveChange = { id: nodeId, type: "remove" };

    // Filter out connected edges
    const connectedEdges = get().edges.filter(
      (edge) => edge.source === nodeId || edge.target === nodeId,
    );
    // Create remove changes for connected edges
    const removeEdgeChanges: EdgeRemoveChange[] = connectedEdges.map((edge) => {
      return { id: edge.id, type: "remove" };
    });
    // Apply edges changes to the store
    set({
      edges: applyEdgeChanges(removeEdgeChanges, get().edges),
    });
    // Apply node changes to the store
    set({
      nodes: applyNodeChanges([removeChange], get().nodes),
    });
    // Save to local storage
    get().backup();
  },
  setSelectedEdge: (edgeId: string | null) => {
    console.log("edgeId", edgeId);
    if (!edgeId) {
      set({
        selectedEdge: null,
      });
    } else {
      set({ selectedEdge: get().edges.find((n) => n.id === edgeId) });
    }
  },
  updateEdgeConfiguration: (
    edgeId: string,
    configuration: any,
    temporaryConfiguration: boolean,
  ) => {
    const updatedEdges = get().edges.map((edge) => {
      if (edge.id !== edgeId) return edge;
      let updatedEdgeData: TBaseEdgeData;

      if (temporaryConfiguration) {
        updatedEdgeData = {
          ...edge.data,
          edgeTempConfiguration: configuration,
        };
      } else {
        updatedEdgeData = {
          ...edge.data,
          edgeConfiguration: configuration,
        };
      }
      return {
        ...edge,
        data: updatedEdgeData,
      };
    });
    set({
      edges: updatedEdges,
    });

    // Save to local storage if not temporary
    if (!temporaryConfiguration) {
      get().backup();
    }
  },
  updateNodeConfiguration: (
    nodeId: string,
    configuration: TMainCompanyConfiguration | TIndividualOwnerConfiguration,
    temporaryConfiguration: boolean,
  ) => {
    const updatedNodes = get().nodes.map((node) => {
      if (node.id !== nodeId) return node;
      let updatedNodeData: TBaseNodeData;

      if (temporaryConfiguration) {
        updatedNodeData = {
          ...node.data,
          nodeTempConfiguration: configuration,
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
