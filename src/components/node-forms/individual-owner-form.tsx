import useStore from "@/common/store/store";
import {
  edgeConfigurationSelector,
  nodeConfigurationSelector,
} from "@/common/store/selectors";
import { shallow } from "zustand/shallow";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { capitalizeNodeType } from "@/lib/utils";
import {
  getIndividualOwnerEdgeSchema,
  getIndividualOwnerSchema,
} from "@/components/node-forms/schemas/individual-owner-schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CountriesSelectList,
  NodeSheetFooter,
  NodeSheetHeader,
} from "@/components/node-forms/misc-form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TIndividualOwnerConfiguration,
  TIndividualOwnerEdgeConfiguration,
} from "@/components/nodes/types";
import { Separator } from "@/components/ui/separator";
import { Arrow } from "@radix-ui/react-arrow";
import { ArrowRight } from "react-feather";

type TIndividualOwnerOwnership = {
  companyName: string;
  ownershipPercentage: number;
};

function IndividualOwnerForm() {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { nodes, edges, selectedNode, countries, updateNodeConfiguration } =
    useStore(nodeConfigurationSelector, shallow);

  const nodeType = useMemo(
    () => capitalizeNodeType(selectedNode?.type || ""),
    [selectedNode?.type],
  );

  const individualFormSchema = getIndividualOwnerSchema();

  const getDefaultFormValues = useCallback(() => {
    return (
      selectedNode?.data?.nodeConfiguration ||
      selectedNode?.data?.nodeTemporaryConfiguration || {
        nodeTitle: "",
        residence: "",
      }
    );
  }, [selectedNode]);

  const individualOwnerForm = useForm({
    resolver: zodResolver(individualFormSchema),
    defaultValues: getDefaultFormValues(),
  });

  const { control, handleSubmit, watch, register, getValues } =
    individualOwnerForm;

  // Form watcher
  useEffect(() => {
    const subscription = individualOwnerForm.watch((values) => {
      const formTempState = getValues();
      const nodeTempConfiguration: TIndividualOwnerConfiguration = {
        nodeConfigurationSaved: false,
        nodeTitle: formTempState.nodeTitle,
        residence: formTempState.residence,
      };
      // Verify selectedNode is not null and update node configuration
      if (!selectedNode?.id) return;
      updateNodeConfiguration(selectedNode?.id, nodeTempConfiguration, true);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  function onSubmit(data: any) {
    if (!selectedNode?.id) return;

    const nodeConfiguration: TIndividualOwnerConfiguration = {
      nodeConfigurationSaved: true,
      nodeTitle: data.nodeTitle,
      residence: data.residence,
    };
    updateNodeConfiguration(selectedNode.id, nodeConfiguration, false);
    closeButtonRef.current?.click();
  }

  const ownershipsList = useMemo((): TIndividualOwnerOwnership[] => {
    // Filter edges connected to the selected node
    const connectedEdges = edges.filter(
      (edge) => edge.source === selectedNode?.id,
    );

    // Map connected edges to ownership objects
    const ownershipsMap = connectedEdges.map((edge) => ({
      companyName: edge.target,
      ownershipPercentage:
        edge.data?.edgeConfiguration?.ownershipPercentage || 0, // Default value if not available
    }));

    // Map ownershipsMap to final ownerships list with company names resolved
    return ownershipsMap
      .map((ownership) => {
        const connectedNode = nodes.find(
          (node) => node.id === ownership.companyName,
        );
        return {
          companyName: `${connectedNode?.data?.nodeConfiguration?.nodeTitle} - ${connectedNode?.data?.nodeConfiguration?.residence}`,
          ownershipPercentage: ownership.ownershipPercentage,
        };
      })
      .filter(
        (ownership) => ownership.companyName && ownership.ownershipPercentage,
      ); // Filter out invalid entries
  }, [edges, nodes, selectedNode]);

  return (
    <Form {...individualOwnerForm}>
      <div className="py-4">
        <NodeSheetHeader nodeType={nodeType} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <FormField
          name="nodeTitle"
          control={control}
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-2 py-2 items-start">
                <FormLabel>{`${nodeType} name`}</FormLabel>
                <Input type="text" placeholder="Enter name" {...field} />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="residence"
          control={control}
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-2 py-2 items-start">
                <FormLabel>Country residence</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <CountriesSelectList countries={countries} />
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="my-4" />
        <IndividualOwnerOwnership ownerships={ownershipsList} />
        <NodeSheetFooter closeButtonRef={closeButtonRef} />
      </form>
    </Form>
  );
}

function IndividualOwnerOwnership({
  ownerships,
}: {
  ownerships: TIndividualOwnerOwnership[];
}) {
  return (
    <>
      <span>Ownership</span>
      {ownerships.map((ownership, index) => (
        <div key={index} className="flex flex-col py-2 gap-2">
          <div className="flex flex-row w-full space-x-2">
            <FormItem className="flex-grow">
              <div className="flex">
                <Input
                  type="text"
                  readOnly
                  placeholder={ownership.companyName}
                />
              </div>
              <FormMessage />
            </FormItem>
            <FormItem className="flex-grow">
              <div className="flex">
                <Input
                  type="number"
                  readOnly
                  placeholder={`${ownership.ownershipPercentage}%`}
                />
              </div>
              <FormMessage />
            </FormItem>
          </div>
        </div>
      ))}
    </>
  );
}

function IndividualOwnerEdgeForm() {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { nodes, selectedEdge, updateEdgeConfiguration } = useStore(
    edgeConfigurationSelector,
    shallow,
  );

  const sourceNode = useMemo(() => {
    return nodes.find((node) => node.id === selectedEdge?.source);
  }, [selectedEdge?.source]);

  const targetNode = useMemo(() => {
    return nodes.find((node) => node.id === selectedEdge?.target);
  }, [selectedEdge?.target]);

  function getDefaultFormValues() {
    return {
      ownershipPercentage:
        selectedEdge?.data?.edgeConfiguration?.ownershipPercentage || 0,
    };
  }

  const individualFormSchema = getIndividualOwnerEdgeSchema();
  const individualOwnerEdgeForm = useForm({
    resolver: zodResolver(individualFormSchema),
    defaultValues: getDefaultFormValues(),
  });
  const { control, handleSubmit, formState, getValues, watch } =
    individualOwnerEdgeForm;

  function updateEdgeConfig(dataSource: any, temporaryConfiguration: boolean) {
    const edgeTempConfiguration: TIndividualOwnerEdgeConfiguration = {
      edgeConfigurationSaved: !temporaryConfiguration,
      sourceNodeId: sourceNode!.id,
      targetNodeId: targetNode!.id,
      ownershipPercentage: parseInt(dataSource.ownershipPercentage),
    };

    if (selectedEdge) {
      console.log(
        "Updating edge configuration",
        dataSource,
        temporaryConfiguration,
      );
      updateEdgeConfiguration(
        selectedEdge.id,
        edgeTempConfiguration,
        temporaryConfiguration,
      );
    }
  }

  useEffect(() => {
    const sub = watch((value, { name }) => {
      if (name !== "ownershipPercentage") return;
      const formTempState = getValues();
      updateEdgeConfig(formTempState, true);
    });
    return () => sub.unsubscribe();
  }, [watch]);

  function onSubmit(data: any) {
    console.log("On submit", data);
    updateEdgeConfig(data, false);
    closeButtonRef.current?.click();
  }

  return (
    <Form {...individualOwnerEdgeForm}>
      <div className="py-4">{/*<NodeSheetHeader nodeType={nodeType}/>*/}</div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <div className="flex flex-row w-full space-x-2">
          <FormItem className="flex-grow">
            <div className="flex">
              <Input
                type="text"
                readOnly
                placeholder={`${sourceNode?.data.nodeConfiguration.nodeTitle} - ${sourceNode?.data.nodeConfiguration.residence}`}
              />
            </div>
            <FormMessage />
          </FormItem>
          <FormItem className="flex-grow content-center">
            <div className="flex justify-center">
              <ArrowRight />
            </div>
            <FormMessage />
          </FormItem>
          <FormItem className="flex-grow">
            <div className="flex">
              <Input
                type="text"
                readOnly
                placeholder={`${targetNode?.data?.nodeConfiguration?.nodeTitle} - ${targetNode?.data?.nodeConfiguration?.residence}`}
              />
            </div>
            <FormMessage />
          </FormItem>
        </div>
        <Separator className="mt-6 mb-3" />
        <FormField
          name="ownershipPercentage"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col py-2 gap-2.5">
              <FormLabel>Ownership percentage</FormLabel>
              <FormItem className="flex-grow">
                <Input
                  type="number"
                  placeholder="Enter ownership percentage"
                  {...field}
                />
              </FormItem>
              <FormMessage />
            </div>
          )}
        />
        <NodeSheetFooter closeButtonRef={closeButtonRef} />
      </form>
      {/*Debug form state:*/}
      {/*{formState.errors && (*/}
      {/*  <>*/}
      {/*    <pre>{JSON.stringify(formState, null, 2)}</pre>*/}
      {/*    <pre>{JSON.stringify(formState.errors, null, 2)}</pre>*/}
      {/*  </>*/}
      {/*)*/}
      {/*}*/}
    </Form>
  );
}

export { IndividualOwnerForm, IndividualOwnerEdgeForm };
