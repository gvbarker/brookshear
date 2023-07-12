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
    <div className="">
      <Memory 
        data={memory} 
        onAssemble={(() => onAssemble())}
      />
      <InputBox/>
      <button 
        onClick={(() => onAssemble())}
      >
        Assemble
      </button>
      <button onClick={(() => onRun())}>Run</button>
    </div>
  );
}