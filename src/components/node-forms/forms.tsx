import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore from "@/common/store/store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCompanyFormSchema,
  getBaseFormSchema,
} from "@/components/node-forms/schemas/base-form-schemas";
import { MainCompanyForm } from "@/components/node-forms/main-company-form";
import { TMainCompanyConfiguration } from "@/components/nodes/types";
import { shallow } from "zustand/shallow";
import { capitalizeNodeType } from "@/lib/utils";
import {
  CountriesSelectList,
  NodeSheetFooter,
  NodeSheetHeader,
} from "@/components/node-forms/misc-form";
import { nodeConfigurationSelector } from "@/common/store/selectors";
import { Split } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { COLORS } from "@/components/colors/colors";
import { Button } from "@/components/ui/button";

export function BaseNodeForm() {
  const {
    selectedNode,
    companyOrgFormsTypes,
    countries,
    updateNodeConfiguration,
  } = useStore(nodeConfigurationSelector, shallow);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const nodeType = useMemo(
    () => capitalizeNodeType(selectedNode?.type || ""),
    [selectedNode?.type],
  );

  const [companyType, setCompanyType] = useState(
    selectedNode?.data?.nodeConfiguration ||
      selectedNode?.data?.nodeTemporaryConfiguration?.companyType ||
      "",
  );

  const mappedCompanyTypes: string[] = companyOrgFormsTypes.map((type) => {
    return type.name.toLowerCase() === "llc"
      ? type.name.toUpperCase()
      : type.name;
  });

  function getDefaultFormValues() {
    return (
      selectedNode?.data?.nodeConfiguration ||
      selectedNode?.data?.nodeTemporaryConfiguration || {
        nodeNamed: "",
        type: "",
        residence: "",
        // people: [{ name: "", memberInterest: 0, residence: "" }],
        shareCapital: 0,
        directors: 0,
      }
    );
  }

  const baseFormSchema = getBaseFormSchema(mappedCompanyTypes);
  const companyFormSchema = companyType ? getCompanyFormSchema() : z.object({});

  const form = useForm({
    resolver: zodResolver(baseFormSchema.merge(companyFormSchema)),
    defaultValues: getDefaultFormValues(),
  });

  const { control, handleSubmit, watch, getValues, formState } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "people",
  });

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      const formTempState = getValues();
      const nodeTempConfiguration: TMainCompanyConfiguration = {
        nodeTitle: formTempState.nodeTitle,
        residence: formTempState.residence,
        type: formTempState.type,
        people: formTempState.people,
        shareCapital: formTempState.shareCapital,
        directors: formTempState.directors,
        nodeConfigurationSaved: false,
      };

      // Verify selectedNode is not null and update node configuration
      if (selectedNode) {
        updateNodeConfiguration(selectedNode?.id, nodeTempConfiguration, true);
      }
      if (name === "type" && value) {
        // @ts-ignore
        setCompanyType(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Handle form submission
  function onSubmit(data: any) {
    console.log("data on submit", data);
    // Verify selectedNode is not null and update node configuration
    if (!selectedNode?.id) return;

    const nodeConfiguration: TMainCompanyConfiguration = {
      nodeTitle: data.nodeTitle,
      residence: data.residence,
      type: data.type,
      people: data.people,
      shareCapital: data.shareCapital,
      directors: data.directors,
      nodeConfigurationSaved: true,
    };
    updateNodeConfiguration(selectedNode?.id, nodeConfiguration, false);
    closeButtonRef.current?.click();
  }

  return (
    <Form {...form}>
      <div className="py-4">
        <NodeSheetHeader nodeType={nodeType} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <div>
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
                  <FormLabel>Country</FormLabel>
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
          <FormField
            name="type"
            control={control}
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col gap-2 py-2 items-start">
                  <FormLabel>{`${nodeType} type`}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mappedCompanyTypes.map((companyType, id) => (
                        <SelectItem key={id} value={companyType}>
                          {companyType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {companyType && (
            <>
              <Separator className="my-4" />
              {/*<CompanyMembersForm*/}
              {/*  fields={fields}*/}
              {/*  control={control}*/}
              {/*  append={append}*/}
              {/*  remove={remove}*/}
              {/*  countries={countries}*/}
              {/*/>*/}
              <MainCompanyForm control={control} />
            </>
          )}

          {/*Debug form state:*/}
          {/*{formState.errors && (*/}
          {/*  <pre>{JSON.stringify(formState.errors, null, 2)}</pre>*/}
          {/*)*/}
          {/*}*/}
        </div>

        <NodeSheetFooter closeButtonRef={closeButtonRef} />
      </form>
    </Form>
  );
}
