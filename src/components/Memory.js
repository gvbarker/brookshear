import React, { useState } from "react";
import Cell from "./Cell";
import assembler from "../emulator/assembler";
import testASM from "../emulator/testasm";
import cpu from "../emulator/cpu";

export default function Memory({ data }) {
  const [assemblerState, setAssemblerState] = useState(data);
  let emuTest = new assembler();

  function handleCLick() {
    let nextCells = assemblerState.slice();
    
    emuTest.setCodeToAssemble(testASM.cpucode);
    emuTest.assemble();
    const newCells = emuTest.getAssembledCode();
    for (let i = 0; i < newCells.length; i++) {
      nextCells[i] = newCells[i];
    }
    setAssemblerState(nextCells);
  }

  function generate16WidthTable() {
    let newTable = new Array(16);
    for (let i=0; i<16; i++) {
      let offsetIndex = i*16;
      newTable[i] = assemblerState.slice(offsetIndex, offsetIndex+16);
    }
    return (newTable);
  }

  function celltable() {  
    let table = generate16WidthTable();
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
                  ];
                })}
              </tr>
            ];
          })}
        </tbody>
      </table>
    );
  }
  
  return (
    <>
      <div>
        { celltable() }
      </div>
      <button onClick={handleCLick}>assemble</button>
      <button onClick={(() => {
        let emucpu = new cpu(assemblerState);
        let nextCells = assemblerState.slice();
        emucpu.run();
        const newCells = emucpu.getNewMem();
        for (let i = 0; i < newCells.length; i++) {
          nextCells[i] = newCells[i];
        }
        setAssemblerState(nextCells);
      }

      )}>
        cpu testing
      </button>
    </>
  );
}