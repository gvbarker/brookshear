import React from "react"
import "./App.css";
import Assembler from "./components/Assembler";

function App() {
  return (
    <>
      <Assembler data={Array(256).fill("00")}></Assembler>
    </>
  );
}

export default App;
