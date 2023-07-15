import React from "react";
import "./App.css";
import BoxForm from "./components/BoxForm";
import assembler from "./emulator/assembler";
import cpu from "./emulator/cpu"
function App() {
  const asmt = new assembler();
  const cputt = new cpu() 
  return (
    <>
      <BoxForm 
        asm = { asmt }
        cput = { cputt }
      />
    </>
  );
}

export default App;
