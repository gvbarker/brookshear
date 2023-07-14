import React, { useState } from "react";
import Memory from "./Memory";
import cpu from "../emulator/cpu";
import assembler from "../emulator/assembler";
import testASM from "../emulator/testasm";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";

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
  function handleTextChange(event) {
    setCode(event.target.value);
  } 
  function onAssemble() {
    const assembly = code;
    if (!assembly?.trim()) { return; }
    emulatorASM.setCodeToAssemble(assembly);
    emulatorASM.assemble();
    mutateMem("asm");
  }
  function onRun() {
    emulatorCPU.setProg(memory);
    emulatorCPU.run();
    mutateMem("cpu");
  }
  function onStep() {
    emulatorCPU.step();
    mutateMem("cpu");
  }
  const test = (e) => {
    setCode(e.target.value);
  }
  return (
    <div className="flex bg-slate-600">
      <TextField
        multiline
        placeholder = "Assembly..."
        rows = { 20 }
        value={ code }
        onChange = { handleTextChange }
        className="flex bg-white w-1/3 rounded-lg p-3 overflow-auto"
      />
      <Memory 
        data = { memory } 
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
          onClick = {(() => onAssemble())}
          className="text-white block flex-none h-16 clear-both align-middle p-2"
        >
          Assemble
        </Button>
        <Button
          variant = "outlined" 
          onClick={(() => onRun())}
          className="text-white block flex-none h-16 clear-both align-middle p-2"
        >
          Run
        </Button>
        <Button
          variant = "outlined" 
          onClick={(() => onStep())}
          className="text-white block flex-none h-16 clear-both align-middle p-2"
        >
          Step
        </Button>
      </div>
      
    </div>
  );
}