import React, { useState } from "react";
import Memory from "./Memory";
import { TextField } from "@mui/material";
import EmuButton from "./EmuButton";
import CheatSheet from "./CheatSheet";

export default function BoxForm({ asm, cpu }) {
  const [data, setData] = useState({
    memory: Array(256).fill("00"),
    registers: Array(16).fill("00"),
    code: "",
  });
  function mutateMem(func) {
    const nextCells = data.memory.slice();
    const newCells = func === "asm" ? asm.getAssembledCode() : cpu.getMemory();
    for (let i = 0; i < newCells.length; i++) {
      nextCells[i] = newCells[i];
    }
    setData({ ...data, memory: nextCells });
  }
  function mutateReg() {
    const nextReg = data.registers.slice();
    const newReg = cpu.getRegisterStatus();
    for (let i = 0; i < nextReg.length; i++) {
      let reg = newReg[i].toString(16);
      while (reg.length < 2) {
        reg = "0" + reg;
      }
      reg = reg.toUpperCase();
      nextReg[i] = reg;
    }
    setData({ ...data, registers: nextReg });
  }
  function onAssemble() {
    const assembly = data.code;
    if (!assembly?.trim()) {
      return;
    }
    asm.setCodeToAssemble(assembly);
    asm.assemble();
    mutateMem("asm");
    asm.reset();
  }
  function onRun() {
    cpu.setProg(data.memory);
    cpu.run();
    mutateMem("cpu");
    mutateReg();
    cpu.reset();
  }
  function onStep() {
    if (!cpu.getMemory()?.length) {
      cpu.setProg(data.memory);
    }
    cpu.step();
    mutateMem("cpu");
    mutateReg();
  }
  function onEmuReset() {
    setData({
      ...data,
      memory: Array(256).fill("00"),
      registers: Array(16).fill("00"),
    });
    asm.reset();
    cpu.setProg();
    cpu.reset();
  }
  return (
    <div className="flex bg-slate-600">
      <TextField
        multiline
        placeholder="Assembly..."
        rows={20}
        value={data.code}
        onChange={(e) => setData({ ...data, code: e.target.value })}
        className="flex bg-white w-1/3 rounded-lg p-3 overflow-auto"
      />
      <Memory page={data.memory} />
      <Memory page={data.registers} type={"reg"} />
      <div className="bg-stone-700 rounded-lg w-1/6 p-2 text-center">
        <h1 className="rounded-lg text-white p-2">EMULATOR FUNCTIONS</h1>
        <table className="my-0 mx-auto">
          <tr>
            <EmuButton value={"Assemble"} handleClick={() => onAssemble()} />
          </tr>
          <tr>
            <EmuButton value={"Run"} handleClick={() => onRun()} />
          </tr>
          <tr>
            <EmuButton value={"Step"} handleClick={() => onStep()} />
          </tr>
          <tr>
            <EmuButton value={"Reset"} handleClick={() => onEmuReset()} />
          </tr>
        </table>
        
      </div>
      <CheatSheet/>
      
    </div>
  );
}
