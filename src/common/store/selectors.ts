import { StoreStateActions } from "@/common/store/store";

export const nodeConfigurationSelector = (state: StoreStateActions) => ({
  selectedNode: state.selectedNode,
  companyOrgFormsTypes: state.companyOrgFormsTypes,
  countries: state.countries,
  fetchContainersConfiguration: state.fetchContainersConfiguration,
  updateNodeConfiguration: state.updateNodeConfiguration,
});

export const edgeConfigurationSelector = (state: StoreStateActions) => ({
  nodes: state.nodes,
  selectedEdge: state.selectedEdge,
  setSelectedEdge: state.setSelectedEdge,
  updateNodeConfiguration: state.updateNodeConfiguration,
  updateEdgeConfiguration: state.updateEdgeConfiguration,
});
