import React from "react";

export type NodeType =
  | "main_company"
  | "client_customer"
  | "individual_owner"
  | "contractor"
  | "subsidiary_company"
  | "unrelated_company";

export type BaseNodeData = {
  label: string;
  residence: string | undefined;
  attributes: [NodeDataAttributes] | undefined;
  isPreview?: boolean;
  IconComponent: React.ReactNode<any>;
  onConfigIconClick: (nodeId: string) => void;
  onDeleteIconClick: (nodeId: string) => void;
};

export type NodeDataAttributes = {
  label: string;
  value: string;
};
