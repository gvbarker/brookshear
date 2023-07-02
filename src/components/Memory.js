import React, { useState } from "react";
import Cell from "./Cell";

export default function Memory({ data }) {
  const [assemblerState, setAssemblerState] = useState(data);
  function handleCLick() {
    let newtest = ["51", "23", "64", "56", "77", "89", "23", "02", "14", "03", "40", "54", "b1", "03", "b9", "01", "C0", "00"];
    let nextCells = assemblerState.slice();
    
    for (let i=0; i<newtest.length; i++) {
      nextCells[i] = newtest[i];
    }
    setAssemblerState(nextCells);
  }

  function generate16WidthTable() {
    let newTable = new Array(16);
    for (let i=0; i<16; i++) {
      let offsetIndex = i*16;
      newTable[i] = assemblerState.slice(offsetIndex, offsetIndex+16);
    }
    return (newTable)
  }

  function celltable() {  
    let table = generate16WidthTable()
    return (
      <table>
        {table.map((rowValue, rowIndex) => {
          return [
            <tr key={rowIndex}>
              {rowValue.map((columnValue, columnIndex) => {
                return [
                  <td key={ rowIndex.toString(16)+columnIndex.toString(16) }>
                    <Cell key={ columnIndex.toString(16)+columnValue } value={ columnValue}></Cell>
                  </td>
                ]
              })}
            </tr>
          ]
        })}
      </table>
    )
  }
  
  return (
    <>
      <div>
        { celltable() }
      </div>
      <button onClick={handleCLick}>handleClick</button>
    </>
  );
}