import {
  ClientCustomerNode,
  ContractorsNode,
  IndividualOwnerNode,
  MainCompanyNode,
  SubsidiaryCompanyNode,
  UnrelatedCompanyNode,
} from "@/components/nodes/ContainerNodes";

export const systemSupportedNodes = {
  main_company: MainCompanyNode,
  individual_owner: IndividualOwnerNode,
  client_customer: ClientCustomerNode,
  contractor: ContractorsNode,
  subsidiary_company: SubsidiaryCompanyNode,
  unrelated_company: UnrelatedCompanyNode,
};
