import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore, { StoreStateActions } from "@/common/store/store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCompanyFormSchema,
  getFormSchema,
} from "@/components/node-form/form-schemas";
import { CompanyMembersForm } from "@/components/node-form/company-members-form";
import { MainCompanyForm } from "@/components/node-form/main-company-form";
import { TNodeConfiguration } from "@/components/nodes/types";
import { shallow } from "zustand/shallow";

const selector = (state: StoreStateActions) => ({
  selectedNode: state.selectedNode,
  companyOrgFormsTypes: state.companyOrgFormsTypes,
  countries: state.countries,
  fetchContainersConfiguration: state.fetchContainersConfiguration,
  editSelectedNode: state.editSelectedNode,
  updateNodeConfiguration: state.updateNodeConfiguration,
});

export function BaseNodeForm() {
  const {
    selectedNode,
    companyOrgFormsTypes,
    countries,
    fetchContainersConfiguration,
    editSelectedNode,
    updateNodeConfiguration,
  } = useStore(selector, shallow);

  const [companyType, setCompanyType] = useState(
    selectedNode?.data?.nodeTemporaryConfiguration?.nodeType || "",
  );

  const mappedCompanyTypes: string[] = companyOrgFormsTypes.map((type) => {
    return type.name.toLowerCase() === "llc"
      ? type.name.toUpperCase()
      : type.name;
  });

  function getDefaultFormValues() {
    return (
      selectedNode?.data?.nodeTemporaryConfiguration || {
        nodeNamed: "",
        nodeType: "",
        people: [{ name: "", memberInterest: 0, residence: "" }],
        shareCapital: 0,
        directors: 0,
      }
    );
  }

  const baseFormSchema = getFormSchema(mappedCompanyTypes);
  const companyFormSchema = companyType ? getCompanyFormSchema() : z.object({});

  const form = useForm({
    resolver: zodResolver(baseFormSchema.merge(companyFormSchema)),
    defaultValues: getDefaultFormValues(),
  });

  const { control, handleSubmit, watch, register, getValues } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "people",
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const formTempState = getValues();
      const nodeTempConfiguration: TNodeConfiguration = {
        nodeName: formTempState.nodeNamed,
        nodeType: formTempState.nodeType,
        people: formTempState.people,
        shareCapital: formTempState.shareCapital,
        directors: formTempState.directors,
        nodeValidated: false,
      };

      // Verify selectedNode is not null and update node configuration
      if (!selectedNode?.id) return;
      updateNodeConfiguration(selectedNode?.id, nodeTempConfiguration, true);

      if (name === "nodeType" && value) {
        // @ts-ignore
        setCompanyType(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  function onSubmit(data: any) {
    // Handle form submission
    console.log(data);
    editSelectedNode(data.nodeNamed, "");
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-max space-y-6">
        <FormField
          name="nodeNamed"
          control={control}
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-2 py-2 items-start">
                <FormLabel>Node name</FormLabel>
                <Input type="text" placeholder="Node name" {...field} />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="nodeType"
          control={control}
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-2 py-2 items-start">
                <FormLabel>Node type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company type" />
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
            <CompanyMembersForm
              fields={fields}
              control={control}
              append={append}
              remove={remove}
              countries={countries}
            />
            <MainCompanyForm control={control} />
          </>
        )}

        {/*Debug form state:*/}
        {/*{formState.errors && (*/}
        {/*  <pre>{JSON.stringify(formState.errors, null, 2)}</pre>*/}
        {/*)*/}
        {/*}*/}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
