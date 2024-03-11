import { Handle, NodeProps, NodeResizeControl, Position } from "reactflow";
import { BaseNodeData } from "@/app/builder/types";
import React, { memo } from "react";
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
import { InputForm } from "@/components/node-form/forms";
import { Separator } from "@/components/ui/separator";

const controlStyle = {
  background: "transparent",
  border: "none",
};

function ContainerNode({ id, data }: NodeProps<BaseNodeData>) {
  return (
    <Sheet>
      <SheetContent>
        <div className="flex flex-col h-full justify-between">
          <div>
            <SheetHeader>
              <SheetTitle>Edit node</SheetTitle>
              <SheetDescription>
                Configure parameters for the node. Once ready, click Save.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <InputForm />
            </div>
          </div>
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
        </div>
      </SheetContent>
      <div className="flex flex-col h-full px-6 py-8 rounded-md border bg-white border-stone-400 cursor-pointer">
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
          {!data.isPreview && (
            <>
              <div className="flex flex-col ml-16 mr-4 nodrag justify-end hover:bg-gray-100 hover:rounded-md">
                <SheetTrigger onClick={() => data.onConfigIconClick(id)}>
                  <div style={{ color: COLORS.GREY }} className="p-2">
                    <Settings />
                  </div>
                </SheetTrigger>
              </div>
              <div
                className="flex flex-col mr-2 nodrag justify-end hover:bg-red-200 hover:rounded-md"
                onClick={() => data.onDeleteIconClick(id)}
              >
                <div style={{ color: COLORS.GREY }} className="p-2">
                  <Trash2 />
                </div>
              </div>
            </>
          )}
        </div>
        {!data.isPreview && (
          <>
            <NodeResizeControl
              style={controlStyle}
              minWidth={100}
              minHeight={70}
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
