'use client';

import * as React from 'react';
import {Background, ReactFlow, useEdgesState, useNodesState} from "reactflow";
import 'reactflow/dist/style.css';


type Props = {};

const Page = (props: Props) => {
  const onInit = (reactFlowInstance: any) => console.log('flow loaded:', reactFlowInstance);

  const initialNodes = [
    {
      id: 'hidden-1',
      type: 'input',
      data: {label: 'Node 1'},
      position: {x: 250, y: 5},
    },
    {id: 'hidden-2', data: {label: 'Node 2'}, position: {x: 100, y: 100}},
    {id: 'hidden-3', data: {label: 'Node 3'}, position: {x: 400, y: 100}},
    {id: 'hidden-4', data: {label: 'Node 4'}, position: {x: 400, y: 200}},
  ];

  const initialEdges = [
    {id: 'hidden-e1-2', source: 'hidden-1', target: 'hidden-2'},
    {id: 'hidden-e1-3', source: 'hidden-1', target: 'hidden-3'},
    {id: 'hidden-e3-4', source: 'hidden-3', target: 'hidden-4'},
  ];

  // const initialEdges = [{id: 'e1-2', source: '1', target: '2'}];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // const edgesWithUpdatedTypes = edges.map((edge) => {
  //   if (edge.sourceHandle) {
  //     // @ts-ignore
  //     const edgeType = nodes.find((node) => node.type === 'custom').data.selects[edge.sourceHandle];
  //     edge.type = edgeType;
  //   }

  //   return edge;
  // });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={onInit}
      attributionPosition="top-right"
    >
      <Background color="#aaa" gap={32}/>
    </ReactFlow>
  );
};

export default Page;