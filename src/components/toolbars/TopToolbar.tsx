import React from "react";

function TopToolbar(
  props: { height: number; children: React.ReactNode } = {
    height: 16,
    children: <></>,
  },
) {
  return (
    <div
      className={`absolute w-full h-${props.height} bg-background bg-red-white shadow-xl`}
    >
      <div className="mx-16 my-3 flex justify-between items-center">
        {props.children}
      </div>
    </div>
  );
}

export default TopToolbar;
