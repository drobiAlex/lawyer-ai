import React from "react";

export type TBaseNodeConfiguration = {
  nodeValidated: boolean;
  nodeTitle: string;
};

export type TMainCompanyConfiguration = TBaseNodeConfiguration & {
  companyResidence?: string | null;
  companyType: string;
  people: {
    name: string;
    memberInterest: number;
    residence: string;
  }[];
  shareCapital: number;
  directors: number;
};

export type TIndividualOwnerConfiguration = TBaseNodeConfiguration & {
  residence: string;
};

export type TBaseNodeData = {
  randomName: string;
  nodeConfiguration:
    | TMainCompanyConfiguration
    | TIndividualOwnerConfiguration
    | null;
  nodeTemporaryConfiguration:
    | TMainCompanyConfiguration
    | TIndividualOwnerConfiguration
    | null;
  isPreview?: boolean;
  IconComponent: React.ReactNode<any> | null;
  onConfigIconClick: (nodeId: string | null) => void;
  onDeleteIconClick: (nodeId: string) => void;
};
