import { StoreStateActions } from "@/common/store/store";

export const nodeConfigurationSelector = (state: StoreStateActions) => ({
  selectedNode: state.selectedNode,
  companyOrgFormsTypes: state.companyOrgFormsTypes,
  countries: state.countries,
  fetchContainersConfiguration: state.fetchContainersConfiguration,
  editSelectedNode: state.editSelectedNode,
  updateNodeConfiguration: state.updateNodeConfiguration,
});
