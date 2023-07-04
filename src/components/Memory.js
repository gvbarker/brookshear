import React, { useState } from "react";
import Cell from "./Cell";
import assembler from "../emulator/assembler"

export default function Memory({ data }) {
  const [assemblerState, setAssemblerState] = useState(data);
  const testCode = `;3-op functions
group1:
  add r1,r2,r3
  sub r4,r5,r6 ;testing
  ior rA,rB,rC

;2-op functions
group2:
mov r3,r2
ldr r4,$03
  
;jump functions
group3: 
beq r1,$03
beq r9,group1
hlt`
  let emuTest = new assembler(testCode)


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
        <tbody>
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
        </tbody>
      </table>
    )
  }
  
  return (
    <>
      <div>
        { celltable() }
      </div>
      <button onClick={handleCLick}>handleClick</button>
      <button onClick={(() => emuTest.assemble())}>assembler</button>
    </>
  );
}