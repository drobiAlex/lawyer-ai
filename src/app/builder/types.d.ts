export type NodeType =
  'main_company'
  | 'client_customer'
  | 'individual_owner'
  | 'contractor'
  | 'subsidiary_company'
  | 'unrelated_company';

export type NodeData = {
  label: string;
  residence: string | undefined;
  // type: NodeType;
  attributes: [NodeDataAttributes] | undefined;
  isPreview?: boolean;
}

export type NodeDataAttributes = {
  label: string;
  value: string
}