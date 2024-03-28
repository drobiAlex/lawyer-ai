import React, { memo } from "react";
import { EdgeProps } from "reactflow";
import { IndividualOwnerEdgeForm } from "@/components/node-forms/individual-owner-form";
import { TBaseEdgeData } from "@/components/edges/edges";
import CustomBaseEdge from "@/components/edges/CustomBaseEdge";

function DefaultEdge({ ...props }: EdgeProps<TBaseEdgeData>) {
  return (
    <>
      <CustomBaseEdge {...props}>
        <IndividualOwnerEdgeForm />
      </CustomBaseEdge>
    </>
  );
}

export default memo(DefaultEdge);
