'use client';

import * as React from 'react';
import Xarrow, {useXarrow, Xwrapper} from "react-xarrows";
import Draggable from 'react-draggable';

type Props = {};

const boxStyle = {border: 'grey solid 2px', borderRadius: '10px', padding: '5px'};


const DraggableBox = ({id}: { id: string }) => {
  const updateXarrow = useXarrow();
  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
      <div id={id} style={boxStyle}>
        {id}
      </div>
    </Draggable>
  );
};

const Example = () => {
  return (
    <div
      style={{display: "flex", justifyContent: "space-evenly", width: "100%"}}
    >
      <Xwrapper>
        <DraggableBox id={'elem1'}/>
        <DraggableBox id={'elem2'}/>
        <Xarrow start={'elem1'} end="elem2"/>
      </Xwrapper>

    </div>
  );

}

const Page = (props: Props) => {
  return (
    <div>
      <div>
        <h1>Hello</h1>
      </div>
      <Example/>

    </div>
  );
};

export default Page;