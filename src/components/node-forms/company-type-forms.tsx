import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";

function LLCCompanyTypeForm({ control }: any) {
  return (
    <>
      <FormField
        name="shareCapital"
        control={control}
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-col gap-2 py-2 items-start">
              <FormLabel>Share capital</FormLabel>
              <Input type="number" placeholder="Share capital" {...field} />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="directors"
        control={control}
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-col gap-2 py-2 items-start">
              <FormLabel>Directors</FormLabel>
              <Input
                type="number"
                placeholder="Number of directors"
                {...field}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function StockHoldingCompanyForm({ control }: any) {
  return LLCCompanyTypeForm({ control });
}

function PartnershipCompanyForm({ control }: any) {
  return <> </>;
}

function FoundationCompanyForm({ control }: any) {
  return (
    <>
      <FormField
        name="directors"
        control={control}
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-col gap-2 py-2 items-start">
              <FormLabel>Directors</FormLabel>
              <Input
                type="number"
                placeholder="Number of directors"
                {...field}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export {
  LLCCompanyTypeForm,
  StockHoldingCompanyForm,
  PartnershipCompanyForm,
  FoundationCompanyForm,
};
