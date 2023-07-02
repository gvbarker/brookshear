import React from "react"
import "./App.css";
import Assembler from "./components/Assembler";

function App() {
  function generateAssemblerDataTable() {
    let dataTable = Array(17).fill("00").map(row => Array(17).fill("00"));
    for (let i=0; i<16; i++) {
      dataTable[i+1][0]="0"+i.toString(16).toUpperCase();
      dataTable[0][i+1]="0"+i.toString(16).toUpperCase();
    }
    dataTable[0][0]="";
    let table = dataTable.slice(1, dataTable.length).map(i => i.slice(1, i.length));
    return (Array(256).fill("00"));
    //return (table);
  }
  return (
    <>
      <Assembler data={generateAssemblerDataTable()}></Assembler>
    </>
  );
}

export default App;
