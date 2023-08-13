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
    <div className="w-full">
      <Header />
      <div className="bg-zinc-700 h-screen">
        <BoxForm
          asm={emuASM}
          cpu={emuCPU}
        />
      </div>
    </div>
  );
}

export default App;
