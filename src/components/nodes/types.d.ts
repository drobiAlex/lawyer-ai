import React from "react";

export type TNodeType =
  | "main_company"
  | "client_customer"
  | "individual_owner"
  | "contractor"
  | "subsidiary_company"
  | "unrelated_company";

export type TNodeConfiguration = {
  nodeValidated: boolean;
  nodeName: string;
  nodeType: string;
  people: {
    name: string;
    memberInterest: number;
    residence: string;
  }[];
  shareCapital: number;
  directors: number;
};

export type TBaseNodeData = {
  label: string;
  nodeConfiguration: TNodeConfiguration | null;
  nodeTemporaryConfiguration: TNodeConfiguration | null;
  residence?: string | null;
  isPreview?: boolean;
  IconComponent: React.ReactNode<any> | null;
  onConfigIconClick: (nodeId: string | null) => void;
  onDeleteIconClick: (nodeId: string) => void;
};
