import {
  ClientCustomerNode,
  ContractorsNode,
  IndividualOwnerNode,
  MainCompanyNode,
  SubsidiaryCompanyNode,
  UnrelatedCompanyNode,
} from "@/components/nodes/nodes";

export const systemSupportedNodes = {
  main_company: MainCompanyNode,
  subsidiary_company: SubsidiaryCompanyNode,
  unrelated_company: UnrelatedCompanyNode,
  individual_owner: IndividualOwnerNode,
  client_customer: ClientCustomerNode,
  contractor: ContractorsNode,
};
