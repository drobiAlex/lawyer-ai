import { NodeProps, NodeResizeControl } from "reactflow";
import { TBaseNodeData } from "@/components/nodes/types";
import React, { memo, useMemo } from "react";
import ClientsCustomersIcon from "@/components/icons/ClientsCustomersIcon";
import MainCompanyIcon from "@/components/icons/MainCompanyIcon";
import ContractorsIcon from "@/components/icons/ContractorsIcon";
import IndividualOwnerIcon from "@/components/icons/IndividualOwnerIcon";
import SubsidiaryCompanyIcon from "@/components/icons/SubsidiaryCompanyIcon";
import UnrelatedCompanyIcon from "@/components/icons/UnrelatedCompanyIcon";
import { Settings, Trash2 } from "react-feather";
import { COLORS } from "@/components/colors/colors";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BaseNodeForm } from "@/components/node-forms/forms";
import { IndividualOwnerForm } from "@/components/node-forms/individual-owner-form";
import NodeHandlers from "@/components/nodes/handlers";
import { cn } from "@/lib/utils";

const controlStyle = {
  background: "transparent",
  border: "none",
};

type NodeFormType = {
  [key: string]: React.FC;
};

const nodeFormTypes: NodeFormType = {
  main_company: BaseNodeForm,
  individual_owner: IndividualOwnerForm,
};

function NodeSheetForm({ nodeType }: { nodeType: string }) {
  const FormComponent = nodeFormTypes[nodeType];
  if (!FormComponent) {
    // Handle unknown node types
    return <div>Error: Unknown node type</div>;
  }
  return <FormComponent />;
}

function NodeDetails({
  data,
  typeName,
}: {
  data: TBaseNodeData;
  typeName: string;
}) {
  return (
    <div className="flex flex-row w-full items-center justify-between">
      <div className="mr-4">
        <data.IconComponent />
      </div>
      <div className="flex-1 flex-col">
        <div className="flex-wrap-reverse">
          <h6 className="text-lg">
            {data?.nodeConfiguration?.nodeTitle || data?.randomName}
          </h6>
        </div>
        {!data.isPreview && <h6 className="text-sm">{typeName}</h6>}
      </div>
    </div>
  );
}

function ActionButtons({ data, id }: { data: TBaseNodeData; id: string }) {
  return (
    <>
      <div className="flex flex-row ml-16 mr-4 nodrag items-center justify-end">
        <SheetTrigger onClick={() => data.onConfigIconClick(id)}>
          <div
            style={{ color: COLORS.GREY }}
            className="p-2 hover:bg-gray-200 hover:rounded-md"
          >
            <Settings className="m-2" />
          </div>
        </SheetTrigger>
      </div>
      <div
        className="flex flex-row mr-2 nodrag items-center justify-end"
        onClick={() => data.onDeleteIconClick(id)}
      >
        <div
          style={{ color: COLORS.GREY }}
          className="p-2 hover:bg-red-200 hover:rounded-md"
        >
          <Trash2 className="m-2" />
        </div>
      </div>
    </>
  );
}

function ContainerNode({ id, type, data }: NodeProps<TBaseNodeData>) {
  const typeName = useMemo(() => {
    const capitalizedTypeName = type.charAt(0).toUpperCase() + type.slice(1);
    return capitalizedTypeName.split("_").join(" ");
  }, []);

  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) {
          data.onConfigIconClick(null);
        }
      }}
    >
      <SheetContent className="sm:max-w-none sm:max-w-xl">
        <NodeSheetForm nodeType={type} />
      </SheetContent>
      <div
        className={cn(
          "flex flex-row h-full rounded-md border bg-white border-stone-400 cursor-pointer",
          {
            "p-4": data.isPreview,
            "px-6 py-8": !data.isPreview,
          },
        )}
      >
        <NodeDetails data={data} typeName={typeName} />
        {!data.isPreview && (
          <>
            <ActionButtons data={data} id={id} />
            <NodeResizeControl
              style={controlStyle}
              minWidth={400}
              minHeight={100}
            />
            <NodeHandlers nodeType={type} />
          </>
        )}
      </div>
    </Sheet>
  );
}

const ClientCustomerNode = memo((props: NodeProps<TBaseNodeData>) => {
  props.data.IconComponent = ClientsCustomersIcon;
  return <ContainerNode {...props} />;
});

const MainCompanyNode = memo((props: NodeProps<TBaseNodeData>) => {
  props.data.IconComponent = MainCompanyIcon;
  return <ContainerNode {...props} />;
});

const IndividualOwnerNode = memo((props: NodeProps<TBaseNodeData>) => {
  props.data.IconComponent = IndividualOwnerIcon;
  return <ContainerNode {...props} />;
});

const ContractorsNode = memo((props: NodeProps<TBaseNodeData>) => {
  props.data.IconComponent = ContractorsIcon;
  return <ContainerNode {...props} />;
});

const SubsidiaryCompanyNode = memo((props: NodeProps<TBaseNodeData>) => {
  props.data.IconComponent = SubsidiaryCompanyIcon;
  return <ContainerNode {...props} />;
});

const UnrelatedCompanyNode = memo((props: NodeProps<TBaseNodeData>) => {
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
