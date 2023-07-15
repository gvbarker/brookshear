import React, { memo, useState } from "react";
import Memory from "./Memory";
//import cpu from "../emulator/cpu";
import assembler from "../emulator/assembler";
import testASM from "../emulator/testasm";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";

export default function BoxForm({asm, cput}) {
  const [memory, setMemory] = useState(Array(256).fill("00"));
  const [registers, setRegisters] = useState(Array(16).fill(0));
  const [code, setCode] = useState("");
  function mutateMem(func) {
    let nextCells = memory.slice();
    const newCells = (func === "asm") ? asm.getAssembledCode() : cput.getMemory();
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
    asm.setCodeToAssemble(assembly);
    
    asm.assemble();
    console.log(asm.assembledCode)
    console.log(asm.getAssembledCode())
    mutateMem("asm");
    console.log(memory)
  }
  function onRun() {
    cput.setProg(memory);
    cput.run();
    mutateMem("cpu");
  }
  function onStep() {
    if (!cput.getMemory()?.length) {
      console.log("here")
      cput.setProg(memory);
    }
    cput.step();
    mutateMem("cpu");
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