'use client';

import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';

import {addEdge, Background, Panel, ReactFlow, useEdgesState, useNodesState} from "reactflow";

import 'reactflow/dist/style.css';
import {initialEdgeses, initialNodes} from "@/app/builder/data";
import {SavedState} from "@/app/builder/types";
import {SavedStatesList} from "@/components/SavedStatesList";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';


const Page = () => {
  const [rfInstance, setRfInstance] = useState<any | null>(null);
  const [saves, setSaves] = useState<Array<SavedState>>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgeses);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const localStorageSaves: Array<SavedState> = Object.keys(localStorage)
      .filter((key) => key.includes('flow_'))
      .map((key) => (
        {
          key: key,
          object: JSON.parse(localStorage.getItem(key) || ''),
        })
      );
    setSaves(localStorageSaves);
    console.log('saves', localStorageSaves);
  }, []);

  const onConnect = useCallback(
    (connection: any) =>
      setEdges((eds) => addEdge({...connection, animated: true}, eds)),
    [setEdges]
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(`flow_${+new Date()}`, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const getNodeId = () => `randomnode_${+new Date()}`;

  const onAdd = () => {
    const newNode = {
      id: getNodeId(),
      data: {label: 'Added node'},
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      }
    }
    setNodes([...nodes, newNode]);
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={setRfInstance}
      onConnect={onConnect}
      attributionPosition="top-right"
    >
      <Background color="#aaa" gap={32}/>
      <Panel position='top-right'>
        <Button onClick={onAdd}>Add node</Button>
      </Panel>
      <Panel position='bottom-right' style={{flexGrow: 1}}>
        <Card>
          <CardHeader>
            <CardTitle>Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <SavedStatesList savedStates={saves} appySavedStateCallback={() => {
            }}/>
          </CardContent>
          <CardFooter>
            <div className="flex justify-around space-x-80">
              <Button onClick={onSave}>Save</Button>
              <Button>Cancel</Button>
            </div>
          </CardFooter>
        </Card>
      </Panel>
    </ReactFlow>
  );
};

export default Page;