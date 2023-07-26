import React, { useState } from "react";
import Memory from "./Memory";
import { TextField } from "@mui/material";
import EmuButton from "./EmuButton";
import CheatSheet from "./CheatSheet";

export default function BoxForm({ asm, cpu }) {
  const [data, setData] = useState({
    memory: Array.from({ length: 256 }, () => ({
      cellVal: "00",
      cellColor: "bg-white",
    })),
    registers: Array.from({ length: 16 }, () => ({
      regVal: "00",
      regColor: "bg-white",
    })),
    code: "",
  });
  function resetAllColors() {
    const newCells = data.memory.slice();
    const newRegs = data.registers.slice();
    for (let i = 0; i < newCells.length; i++) {
      newCells[i].cellColor = "bg-white";
    }
    for (let i = 0; i < newRegs.length; i++) {
      newRegs[i].regColor = "bg-white";
    }
    cpu.resetColors();
    setData({ ...data, registers: newRegs, memory: newCells });
  }
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
    let newVal = "";
    let newColor = "";
    for (let i = 0; i < nextReg.length; i++) {
      newVal = newReg[i].regVal.toString(16);
      newColor = newReg[i].regColor;
      while (newVal.length < 2) {
        newVal = "0" + newVal;
      }
      newVal = newVal.toUpperCase();
      nextReg[i].regVal = newVal;
      nextReg[i].regColor = newColor;
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
    while (!cpu.stop) {
      resetAllColors();
      cpu.step();
      mutateMem("cpu");
      mutateReg();
    }
    cpu.reset();
  }
  function onStep() {
    if (!cpu.getMemory()?.length) {
      cpu.setProg(data.memory);
    }
    resetAllColors();
    cpu.step();
    mutateMem("cpu");
    mutateReg();
  }
  function onEmuReset() {
    setData({
      ...data,
      memory: Array.from({ length: 256 }, () => ({
        cellVal: "00",
        cellColor: "bg-white",
      })),
      registers: Array.from({ length: 16 }, () => ({
        regVal: "00",
        regColor: "bg-white",
      })),
    });
    asm.reset();
    cpu.setProg();
    cpu.reset();
  }
  return (
    <div className="flex bg-slate-600 px-1">
      <div className="bg-stone-600 inline-block w-1/3 px-2 border-slate-700 border overflow-auto">
        <h1 className="rounded-lg text-white p-1">ASSEMBLY</h1>
        <TextField
          multiline
          placeholder="Assembly..."
          rows={21}
          value={data.code}
          onChange={(e) => setData({ ...data, code: e.target.value })}
          className="flex bg-white rounded-md  overflow-auto"
        />
      </div>
      <Memory
        page={data.memory}
        type={"MEMORY"}
      />
      <Memory
        page={data.registers}
        type={"REGISTERS"}
      />
      <div className="bg-stone-700 rounded-lg w-1/6 p-2 text-center border-slate-700 border">
        <h1 className="rounded-lg text-white p-2">EMULATOR FUNCTIONS</h1>
        <table className="my-0 mx-auto">
          <tbody>
            <tr>
              <td>
                <EmuButton
                  value={"Assemble"}
                  handleClick={() => onAssemble()}
                />
              </td>
            </tr>
            <tr>
              <td>
                <EmuButton
                  value={"Run"}
                  handleClick={() => onRun()}
                />
              </td>
            </tr>
            <tr>
              <td>
                <EmuButton
                  value={"Step"}
                  handleClick={() => onStep()}
                />
              </td>
            </tr>
            <tr>
              <td>
                <EmuButton
                  value={"Reset"}
                  handleClick={() => onEmuReset()}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <CheatSheet />
    </div>
  );
}
