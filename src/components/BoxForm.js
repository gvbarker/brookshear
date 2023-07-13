import React, { useState } from "react";
import Memory from "./Memory";
import InputBox from "./InputBox";
import cpu from "../emulator/cpu";
import assembler from "../emulator/assembler";
import testASM from "../emulator/testasm";

export default function BoxForm() {
  const [memory, setMemory] = useState(Array(256).fill("00"));
  const [code, setCode] = useState("");
  let emulatorASM = new assembler();
  let emulatorCPU = new cpu();
  function mutateMem(func) {
    let nextCells = memory.slice();
    const newCells = (func === "asm") ? emulatorASM.getAssembledCode() : emulatorCPU.getExecutedMemory();
    for (let i = 0; i < newCells.length; i++) {
      nextCells[i] = newCells[i];
    }
    setMemory(nextCells);
  }
  function onAssemble() {
    emulatorASM.setCodeToAssemble(testASM.cpucode);
    emulatorASM.assemble();
    mutateMem("asm");
  }
  function onRun() {
    emulatorCPU.setProg(memory);
    emulatorCPU.run();
    mutateMem("cpu");
  }
  return (
    <div className="flex bg-slate-600">
      <InputBox/>
      <Memory 
        data={memory} 
        onAssemble={(() => onAssemble())}
      />
      <div
        className="block bg-stone-700 rounded-lg w-1/6 float-right p-2"
      >
        <div
          className="rounded-lg text-white p-2"
        >
          ASSEMBLER
          FUNCTIONS
        </div>
        <Button
          variant = "outlined" 
          onClick={(() => onAssemble())}
          className="text-white block flex-none h-16 clear-both align-middle p-2"
        >
          Assemble</Button>
        <button onClick={(() => onRun())}>Run</button>
      </div>
      
    </div>
  );
}