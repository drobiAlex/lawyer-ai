import React, { useEffect, useState } from "react";
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

// function MembersForms(companyType: string, fields: any, register: any, remove: any, append: any) {
//   if (!companyType) {
//     return <> </>;
//   }
//   return (
//     <>
//   )
// }

export function BaseNodeForm() {
  const companyOrgFormsTypes = useStore((state) => state.companyOrgFormsTypes);
  const editSelectedNode = useStore((state) => state.editSelectedNode);
  const fetchContainersConfiguration = useStore(
    (state) => state.fetchContainersConfiguration,
  );
  const [companyType, setCompanyType] = useState("");

  useEffect(() => {
    // Fetch data
    fetchContainersConfiguration();
  }, []);

  const mappedCompanyTypes: string[] = companyOrgFormsTypes.map((type) => {
    return type.name.toLowerCase() === "llc"
      ? type.name.toUpperCase()
      : type.name;
  });

  const baseFormSchema = getFormSchema(mappedCompanyTypes);
  const companyFormSchema = companyType ? getCompanyFormSchema() : z.object({});

  const form = useForm({
    resolver: zodResolver(baseFormSchema.merge(companyFormSchema)),
    defaultValues: {
      nodeNamed: "",
      nodeType: "",
      people: [{ name: "", surname: "", residence: "" }],
    },
  });

  const { control, handleSubmit, watch, register } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "people",
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value !== undefined && name === "nodeType") {
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
      <form onSubmit={handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          name="nodeNamed"
          control={control}
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row gap-2 py-2 items-center">
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
              <div className="flex flex-row gap-2 py-2 items-center">
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
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-2">
                <Input
                  {...register(`people.${index}.name`)}
                  placeholder="Name"
                />
                <Input
                  {...register(`people.${index}.surname`)}
                  placeholder="Surname"
                />
                <Input
                  {...register(`people.${index}.residence`)}
                  placeholder="Residence"
                />
                <Button type="button" onClick={() => remove(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ name: "", surname: "", residence: "" })}
            >
              Add Member
            </Button>
          </>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
