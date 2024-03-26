import useStore from "@/common/store/store";
import { nodeConfigurationSelector } from "@/common/store/selectors";
import { shallow } from "zustand/shallow";
import React, { useCallback, useEffect, useMemo } from "react";
import { capitalizeNodeType } from "@/lib/utils";
import { getIndividualOwnerSchema } from "@/components/node-forms/schemas/individual-owner-schemas";
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
import { TIndividualOwnerConfiguration } from "@/components/nodes/types";

export function IndividualOwnerForm() {
  const { selectedNode, countries, updateNodeConfiguration } = useStore(
    nodeConfigurationSelector,
    shallow,
  );

  const nodeType = useMemo(
    () => capitalizeNodeType(selectedNode?.type || ""),
    [selectedNode?.type],
  );

  const individualFormSchema = getIndividualOwnerSchema();

  const getDefaultFormValues = useCallback(() => {
    return (
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
        nodeValidated: false,
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
    console.log(data);
  }

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
        <NodeSheetFooter />
      </form>
    </Form>
  );
}
