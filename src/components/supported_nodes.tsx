import MainCompanyNode from "@/components/nodes/MainCompanyNode";
import IndividualOwnerNode from "@/components/nodes/IndividualOwnerNode";
import ClientCustomerNode from "@/components/nodes/ClientCustomerNode";
import ContractorsNode from "@/components/nodes/ContractorsNode";
import SubsidiaryCompanyNode from "@/components/nodes/SubsidiaryCompanyNode";
import UnrelatedCompanyNode from "@/components/nodes/UnrelatedCompanyNode";

export const systemSupportedNodes = {
  main_company: MainCompanyNode,
  individual_owner: IndividualOwnerNode,
  client_customer: ClientCustomerNode,
  contractor: ContractorsNode,
  subsidiary_company: SubsidiaryCompanyNode,
  unrelated_company: UnrelatedCompanyNode,
};
