import React from "react";
import Cell from "./Cell";

export default function Memory({ page }) {
  function generate16WidthTable() {
    const newTable = new Array(16);
    for (let i = 0; i < 16; i++) {
      const offsetIndex = i * 16;
      newTable[i] = page.slice(offsetIndex, offsetIndex + 16);
    }
    return newTable;
  }

  function celltable() {
    const table = generate16WidthTable();
    return (
      <table>
        <tbody>
          {table.map((rowValue, rowIndex) => {
            return [
              <tr key={rowIndex}>
                {rowValue.map((columnValue, columnIndex) => {
                  return [
                    <td key={rowIndex.toString(16) + columnIndex.toString(16)}>
                      <Cell
                        key={columnIndex.toString(16) + columnValue}
                        value={columnValue}></Cell>
                    </td>,
                  ];
                })}
              </tr>,
            ];
          })}
        </tbody>
      </table>
    );
  }

  return <div>{celltable()}</div>;
}
