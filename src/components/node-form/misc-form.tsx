import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import React, { memo } from "react";
import { CountryWithFlagEmoji } from "@/common/store/store";
import { SelectContent, SelectItem } from "@/components/ui/select";

export function NodeSheetHeader({ nodeType }: { nodeType: string }) {
  return (
    <SheetHeader>
      <SheetTitle>Edit node</SheetTitle>
      <SheetDescription>
        {`Configure parameters for ${nodeType}. Once ready, click Save.`}
      </SheetDescription>
    </SheetHeader>
  );
}

export function NodeSheetFooter({ saveDisabled }: { saveDisabled: boolean }) {
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

export const CountriesSelectList = memo(
  ({ countries }: { countries: CountryWithFlagEmoji[] }) => {
    return (
      <SelectContent>
        {countries.map((country, id) => (
          <SelectItem key={id} value={`${country.name} ${country.flag}`}>
            {`${country.name} ${country.flag}`}
          </SelectItem>
        ))}
      </SelectContent>
    );
  },
);
