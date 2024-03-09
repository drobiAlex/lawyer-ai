import { Handle, NodeProps, Position } from "reactflow";
import { BaseNodeData } from "@/app/builder/types";
import ThreeVerticalDotsIcon from "@/components/icons/ThreeVerticalDotsIcon";
import { memo } from "react";
import ClientsCustomersIcon from "@/components/icons/ClientsCustomersIcon";
import MainCompanyIcon from "@/components/icons/MainCompanyIcon";
import ContractorsIcon from "@/components/icons/ContractorsIcon";
import IndividualOwnerIcon from "@/components/icons/IndividualOwnerIcon";
import SubsidiaryCompanyIcon from "@/components/icons/SubsidiaryCompanyIcon";
import UnrelatedCompanyIcon from "@/components/icons/UnrelatedCompanyIcon";

function ContainerNode({ id, data }: NodeProps<BaseNodeData>) {
  return (
    <div
      className="px-6 py-4 rounded-md border bg-white border-stone-400 hover:bg-gray-100 cursor-pointer"
      onClick={() => {
        data.onClick(id);
      }}
    >
      <div className="flex flex-row w-full items-center justify-between">
        <div className="mr-4">
          <data.IconComponent />
        </div>
        <div className="flex-1 flex-col">
          <input
            className={
              "w-full nodrag border-solid border-indigo-600 bg-transparent focus:outline-none focus:rounded-md focus:border-2"
            }
            defaultValue={data.label}
            disabled={data.isPreview}
          />
          <h1>Node type</h1>
        </div>
        <div className="flex flex-col justify-end">
          <ThreeVerticalDotsIcon />
        </div>
      </div>
      {!data.isPreview && (
        <>
          <Handle type="target" position={Position.Bottom} />
        </>
      )}
    </div>
  );
}

const ClientCustomerNode = memo((props: NodeProps<BaseNodeData>) => {
  props.data.IconComponent = ClientsCustomersIcon;
  return <ContainerNode {...props} />;
});

const MainCompanyNode = memo((props: NodeProps<BaseNodeData>) => {
  props.data.IconComponent = MainCompanyIcon;
  return <ContainerNode {...props} />;
});

const IndividualOwnerNode = memo((props: NodeProps<BaseNodeData>) => {
  props.data.IconComponent = IndividualOwnerIcon;
  return <ContainerNode {...props} />;
});

const ContractorsNode = memo((props: NodeProps<BaseNodeData>) => {
  props.data.IconComponent = ContractorsIcon;
  return <ContainerNode {...props} />;
});

const SubsidiaryCompanyNode = memo((props: NodeProps<BaseNodeData>) => {
  props.data.IconComponent = SubsidiaryCompanyIcon;
  return <ContainerNode {...props} />;
});

const UnrelatedCompanyNode = memo((props: NodeProps<BaseNodeData>) => {
  props.data.IconComponent = UnrelatedCompanyIcon;
  return <ContainerNode {...props} />;
});

export {
  MainCompanyNode,
  ClientCustomerNode,
  IndividualOwnerNode,
  ContractorsNode,
  SubsidiaryCompanyNode,
  UnrelatedCompanyNode,
};
