import React from "react";

export default function Cell({ value, color }) {
  return (
    <div
      className={ `bg-${color} border-2 float-left
        text-base font-bold leading-8 
        h-7 -mr-0 -mt-0 p-0 text-center
        w-7`}
    >
      {value}
    </div>
  );
}