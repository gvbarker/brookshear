import React from "react";
import Cell from "./Cell";

export default function Memory({ page, type }) {
  function generate16WidthTable() {
    const newTable = new Array(16);
    for (let i = 0; i < 16; i++) {
      const offsetIndex = i * 16;
      newTable[i] = page.slice(offsetIndex, offsetIndex + 16);
    }
    return newTable;
  }
  function regTable() {
    return (
      <table className="border">
        {page.map((reg, regNum) => {
          return [
            <tr key={"r" + regNum}>
              <td>
                <Cell 
                  value={reg} 
                  color={"white"}  
                />
              </td>
            </tr>,
          ];
        })}
      </table>
    );
  }
  function celltable() {
    const table = generate16WidthTable();
    return (
      <table className="border">
        {table.map((rowValue, rowIndex) => {
          return [
            <tr key={rowIndex}>
              {rowValue.map((columnValue, columnIndex) => {
                return [
                  <td key={rowIndex.toString(16) + columnIndex.toString(16)}>
                    <Cell
                      key={columnIndex.toString(16) + columnValue}
                      value={columnValue.cellVal}
                      color={columnValue.cellColor}
                    />
                  </td>,
                ];
              })}
            </tr>,
          ];
        })}
      </table>
    );
  }
  const returnTable = type === "REGISTERS" ? regTable() : celltable();
  return (
    <div className="inline-block justify-center mx-auto px-2">
      <h1 className="rounded-lg text-white py-2">{type}</h1>
      <div>{returnTable}</div>
    </div>
  );
}
