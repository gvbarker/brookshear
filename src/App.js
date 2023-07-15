import React from "react";
import "./App.css";
import BoxForm from "./components/BoxForm";
import assembler from "./emulator/assembler";
import cpu from "./emulator/cpu";
import Header from "./components/Header";
function App() {
  const emuASM = new assembler();
  const emuCPU = new cpu();
  return (
    <>
      <Header/>
      <BoxForm 
        asm = { emuASM }
        cpu = { emuCPU }
      />
    </>
  );
}

export default App;
