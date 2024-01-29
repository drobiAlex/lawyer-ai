// @flow
import * as React from 'react';
import {Separator} from "@/components/ui/separator";

type Props = {
  saves: Array<Object>
};

export function SavedStatesList(props: Props) {
  if (props.saves.length === 0) return <>
    <div className="text-sm text-gray-500">No saved flows</div>
  </>
  return (
    <div>
      <div className="text-sm">Saved flows:</div>
      {
        props.saves.map((save) => {
          return (
            <>
              {/*<div key={save} className="text-sm">*/}
              {/*  {save}*/}
              {/*</div>*/}
              {/*<Separator className="my-2"/>*/}
            </>
          )
        })
      }
    </div>
  );
};