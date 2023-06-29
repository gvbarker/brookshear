import React, { useState } from "react";
import Cell from "./Cell";

export default function Assembler() {
  const [fuck, setfuck] = useState(Array(256).fill("00"));
  function handleCLick() {
    console.log(fuck)
    let newtest = ["51", "23", "64", "56", "77", "89", "23", "02", "14", "03", "40", "54", "b1", "03", "b9", "01", "C0", "00"];
    let nextCells = fuck;
    console.log(nextCells)
    for (let i=0; i<newtest.length; i++) {
      nextCells[i] = newtest[i];
    }
    console.log(nextCells)
    setfuck(nextCells);
    console.log(fuck)
  }

  let cells = fuck.map((val, index) => <Cell key={ index.toString(16) } value={ val }></Cell>);
  return (
    <>
      <div>
        { cells }
      </div>
      <button onClick={handleCLick}>press</button>
    </>
  );
}