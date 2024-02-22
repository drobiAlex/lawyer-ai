// @flow
import {Upload} from "lucide-react";
import * as React from 'react';

import {Separator} from "@/components/ui/separator";


export function SavedStatesList(props: {
  /*global SavedState */
  /*eslint no-undef: "error"*/
  savedStates: Array<SavedState> | undefined
  appySavedStateCallback: (savedState: SavedState) => void
}) {
  const {savedStates, appySavedStateCallback} = props;
  const applySavedState = (savedState: SavedState) => () => appySavedStateCallback(savedState);
  if (savedStates?.length === 0) return <>
    <div className="text-sm text-gray-500">No saved flows</div>
  </>
  return (
    <div>
      <div className="text-sm mb-4">Saved flows:</div>
      {
        savedStates?.map((save) => {
          return (
            <>
              <div className='flex items-center justify-between my-1.5'>
                <div key={save.key} className="text-sm">
                  {save.key}
                </div>
                <Upload onClick={applySavedState(save)} className="ml-2" size={16}/>
              </div>
              <Separator/>
            </>
          )
        })
      }
    </div>
  );
}