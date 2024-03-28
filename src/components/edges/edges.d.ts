export type TIndividualOwnerEdgeConfiguration = {
  edgeConfigurationSaved: boolean;
  sourceNodeId: string;
  targetNodeId: string;
  ownershipPercentage: number;
};

export type TEdgeBaseActions = {
  onEdgeConfigClick: (edgeId: string | null) => void;
};

export type TBaseEdgeData = TEdgeBaseActions & {
  type?: "individualOwner" | null;
  edgeConfiguration: TIndividualOwnerEdgeConfiguration | null;
  edgeTempConfiguration: TIndividualOwnerEdgeConfiguration | null;
};
