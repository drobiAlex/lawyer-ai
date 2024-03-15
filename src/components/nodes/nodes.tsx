import { Handle, NodeProps, NodeResizeControl, Position } from "reactflow";
import { BaseNodeData } from "@/app/builder/types";
import React, { memo, useMemo } from "react";
import ClientsCustomersIcon from "@/components/icons/ClientsCustomersIcon";
import MainCompanyIcon from "@/components/icons/MainCompanyIcon";
import ContractorsIcon from "@/components/icons/ContractorsIcon";
import IndividualOwnerIcon from "@/components/icons/IndividualOwnerIcon";
import SubsidiaryCompanyIcon from "@/components/icons/SubsidiaryCompanyIcon";
import UnrelatedCompanyIcon from "@/components/icons/UnrelatedCompanyIcon";
import { Settings, Trash2 } from "react-feather";
import { COLORS } from "@/components/colors/colors";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BaseNodeForm } from "@/components/node-form/forms";

const controlStyle = {
  background: "transparent",
  border: "none",
};

function NodeSheetHeader() {
  return (
    <SheetHeader>
      <SheetTitle>Edit node</SheetTitle>
      <SheetDescription>
        Configure parameters for the node. Once ready, click Save.
      </SheetDescription>
    </SheetHeader>
  );
}

function NodeSheetForm() {
  return (
    <div className="py-6">
      <BaseNodeForm />
    </div>
  );
}

function NodeSheetFooter() {
  return (
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="outline" type="reset">
          Close
        </Button>
      </SheetClose>
      <SheetClose asChild>
        <Button disabled={true} type="submit">
          Save changes
        </Button>
      </SheetClose>
    </SheetFooter>
  );
}

function NodeDetails({
  data,
  typeName,
}: {
  data: BaseNodeData;
  typeName: string;
}) {
  return (
    <div className="flex flex-row w-full items-center justify-between">
      <div className="mr-4">
        <data.IconComponent />
      </div>
      <div className="flex-1 flex-col">
        <div className="flex-wrap-reverse">
          <h6 className="text-lg">{data.label}</h6>
        </div>
        <h6 className="text-sm">{typeName}</h6>
      </div>
    </div>
  );
}

function ActionButtons({ data, id }: { data: BaseNodeData; id: string }) {
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

function ContainerNode({ id, type, data }: NodeProps<BaseNodeData>) {
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
      <SheetContent>
        <div className="flex flex-col h-full justify-between">
          <div>
            <NodeSheetHeader />
            <NodeSheetForm />
          </div>
          <NodeSheetFooter />
        </div>
      </SheetContent>
      <div className="flex flex-row h-full px-6 py-8 rounded-md border bg-white border-stone-400 cursor-pointer">
        <NodeDetails data={data} typeName={typeName} />
        {!data.isPreview && (
          <>
            <ActionButtons data={data} id={id} />
            <NodeResizeControl
              style={controlStyle}
              minWidth={400}
              minHeight={100}
            />
            <Handle type="source" position={Position.Top} />
            <Handle type="target" position={Position.Bottom} />
          </>
        )}
      </div>
    </Sheet>
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
