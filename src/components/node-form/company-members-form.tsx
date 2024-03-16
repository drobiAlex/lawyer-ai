import {
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
import { Button } from "@/components/ui/button";
import React from "react";
import { ICountry } from "countries-list";

export function CompanyMembersForm({
  fields,
  control,
  append,
  remove,
  countries,
}: {
  fields: any;
  control: any;
  append: (data: any) => void;
  remove: (index: number) => void;
  countries: ICountry[];
}) {
  return (
    <>
      {fields.map(
        (field: { id: React.Key | null | undefined }, index: number) => (
          <div key={field.id} className="flex flex-col gap-2">
            <FormField
              name={`people.${index}.name`}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2 py-2 items-start">
                    <FormLabel>Member name</FormLabel>
                    <Input type="text" placeholder="Member name" {...field} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              name={`people.${index}.memberInterest`}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2 py-2 items-start">
                    <FormLabel>Member Interest</FormLabel>
                    <Input
                      type="number"
                      placeholder="Member Interest"
                      {...field}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`people.${index}.residence`}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col gap-2 py-2 items-start">
                    <FormLabel>Member residence</FormLabel>
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
                        {countries.map((companyType, id) => (
                          <SelectItem key={id} value={companyType.name}>
                            {companyType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" onClick={() => remove(index)}>
              Remove
            </Button>
          </div>
        ),
      )}
      <Button
        type="button"
        onClick={() => append({ name: "", memberInterest: 0, residence: "" })}
      >
        Add Member
      </Button>
    </>
  );
}
