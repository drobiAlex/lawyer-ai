'use client'

// @flow
import * as React from 'react';

import {Loader2} from 'lucide-react';

import {useGetData} from "@/lib/http";

const nodeTypes = [
  {type: 'input', label: 'Input Node', color: 'border-green-600'},
  {type: 'default', label: 'Default Node', color: 'border-blue-600'},
  {type: 'output', label: 'Output Node', color: 'border-red-600'}
];

export function Sidebar() {

  const {
    data,
    loading,
    error
  } = useGetData('flow/nodes');

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="p-3">
      {loading ? (
          <>
            <div className="top-1/2 left-1/2 translate-x-1/2 translate-y-1/2">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin">
                <p className='mt-2 text-sm text-slate-500'>Uploading...</p>
              </Loader2>
            </div>
          </>
        ) :
        (
          <>
            <div>Elements:</div>
            <div className="pt-3 flex flex-col gap-4">
              {nodeTypes.map(({type, label, color}) => (
                <div
                  key={type}
                  className={`p-3 rounded-md border ${color}`}
                  onDragStart={(event) => onDragStart(event, type)}
                  draggable
                >
                  {label}
                </div>
              ))}
            </div>
          </>
        )
      }
    </aside>
  );
}