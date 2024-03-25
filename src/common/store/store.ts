import axios from "axios";
import {
  getCountryCode,
  getEmojiFlag,
  ICountry,
  TCountryCode,
} from "countries-list";
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
  Viewport,
} from "reactflow";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

import { CompanyOrgForm, CompanyOrgFormType } from "@/common/store/api";
import {
  TBaseNodeData,
  TIndividualOwnerConfiguration,
  TMainCompanyConfiguration,
} from "@/components/nodes/types";
import { apiRequestConfig, getEndpoint } from "@/lib/http";

export const flowKey = "working-flow";

// eslint-disable-next-line no-unused-vars
export type addNodeType = (node: TLawframeNode) => void;
export type TLawframeNode = Node & {
  data: TBaseNodeData;
};
export type CountryWithFlagEmoji = ICountry & { flag: string };
// eslint-disable-next-line no-unused-vars
type setSelectedNodeType = (nodeId: string | null) => void;
// eslint-disable-next-line no-unused-vars
type deleteSelectedNodeType = (nodeId: string) => void;

export type StoreState = {
  viewport: Viewport;
  nodes: TLawframeNode[];
  edges: Edge[];
  selectedNode: Node | null;
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
  onConnect: OnConnect;
  fetchContainersConfiguration: () => void;
  setSelectedNode: setSelectedNodeType;
  deleteSelectedNode: deleteSelectedNodeType;
  editSelectedNode: (label: string, type: string) => void;
  updateNodeConfiguration: (
    nodeId: string,
    configuration: TMainCompanyConfiguration | TIndividualOwnerConfiguration,
    temporaryConfiguration: boolean,
  ) => void;
  backup: () => void;
  // eslint-disable-next-line no-unused-vars
  onViewPortChange: (viewport: Viewport) => void;
};

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
  companyOrgForms: [],
  companyOrgFormsTypes: [],
  backup: () => {
    const flow = {
      edges: get().edges,
      nodes: get().nodes,
      viewport: get().viewport,
    };
    localStorage.setItem(flowKey, JSON.stringify(flow));
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
  onConnect: (connection: Connection | Edge) => {
    if (connection as Edge) {
      const edge = { ...connection, type: "custom" };
      set({
        edges: addEdge(edge, get().edges),
      });
    }
    set({
      edges: addEdge(connection as Connection, get().edges),
    });
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
    configuration: TMainCompanyConfiguration | TIndividualOwnerConfiguration,
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
