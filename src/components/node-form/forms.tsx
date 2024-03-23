import React, { useEffect, useMemo, useState } from "react";
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
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { capitalizeNodeType } from "@/lib/utils";
import { getCountryCode, getEmojiFlag, TCountryCode } from "countries-list";

const selector = (state: StoreStateActions) => ({
  selectedNode: state.selectedNode,
  companyOrgFormsTypes: state.companyOrgFormsTypes,
  countries: state.countries,
  fetchContainersConfiguration: state.fetchContainersConfiguration,
  editSelectedNode: state.editSelectedNode,
  updateNodeConfiguration: state.updateNodeConfiguration,
});

function NodeSheetHeader({ nodeType }: { nodeType: string }) {
  return (
    <SheetHeader>
      <SheetTitle>Edit node</SheetTitle>
      <SheetDescription>
        {`Configure parameters for ${nodeType}. Once ready, click Save.`}
      </SheetDescription>
    </SheetHeader>
  );
}

function NodeSheetFooter({ saveDisabled }: { saveDisabled: boolean }) {
  return (
    <SheetFooter>
      <SheetClose asChild>
        <Button variant="outline" type="reset">
          Close
        </Button>
      </SheetClose>
      <Button disabled={saveDisabled} type="submit">
        Save changes
      </Button>
    </SheetFooter>
  );
}

export function BaseNodeForm() {
  const {
    selectedNode,
    companyOrgFormsTypes,
    countries,
    fetchContainersConfiguration,
    editSelectedNode,
    updateNodeConfiguration,
  } = useStore(selector, shallow);

  const nodeType = useMemo(
    () => capitalizeNodeType(selectedNode?.type || ""),
    [selectedNode?.type],
  );
  const [companyType, setCompanyType] = useState(
    selectedNode?.data?.nodeTemporaryConfiguration?.companyType || "",
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
        companyType: "",
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
        companyType: formTempState.companyType,
        people: formTempState.people,
        shareCapital: formTempState.shareCapital,
        directors: formTempState.directors,
        nodeValidated: false,
      };

      // Verify selectedNode is not null and update node configuration
      if (!selectedNode?.id) return;
      updateNodeConfiguration(selectedNode?.id, nodeTempConfiguration, true);

      if (name === "companyType" && value) {
        // @ts-ignore
        setCompanyType(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  function onSubmit(data: any) {
    // Handle form submission
    editSelectedNode(data.nodeNamed, "");
  }

  return (
    <Form {...form}>
      <div className="py-4">
        <NodeSheetHeader nodeType={nodeType} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <div>
          <FormField
            name="nodeNamed"
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
            name="companyResidence"
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
                    <SelectContent>
                      {countries.map((country, id) => (
                        <SelectItem key={id} value={country.name}>
                          {`${getEmojiFlag(getCountryCode(country.name) as TCountryCode)} ${country.name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="companyType"
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
        </div>
        <NodeSheetFooter saveDisabled={true} />
      </form>
    </Form>
  );
}
