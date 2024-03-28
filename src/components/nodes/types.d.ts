import React from "react";

export type TBaseNodeConfiguration = {
  nodeConfigurationSaved: boolean;
  nodeTitle: string;
};

export type TMainCompanyConfiguration = TBaseNodeConfiguration & {
  residence?: string | null;
  type: string;
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
  nodeTempConfiguration:
    | TMainCompanyConfiguration
    | TIndividualOwnerConfiguration
    | null;
  isPreview?: boolean;
  IconComponent: React.ReactNode<any> | null;
  onConfigIconClick: (nodeId: string | null) => void;
  onDeleteIconClick: (nodeId: string) => void;
};
