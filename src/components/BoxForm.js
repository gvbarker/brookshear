import React, { useState } from "react";
import Cell from "./Cell";
import Memory from "./Memory";
import { TextField } from "@mui/material";
import EmuButton from "./EmuButton";

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
      <table>
        <tbody>
          {data.registers.map((reg, regNum) => {
            return [
              <tr key={"r" + regNum}>
                <td>
                  <Cell value={reg} />
                </td>
              </tr>,
            ];
          })}
        </tbody>
      </table>
      <div className="block bg-stone-700 rounded-lg w-1/6 float-right p-2">
        <div className="rounded-lg text-white p-2">ASSEMBLER FUNCTIONS</div>
        <EmuButton
          value={"Assemble"}
          handleClick={() => onAssemble()}
        />
        <EmuButton
          value={"Run"}
          handleClick={() => onRun()}
        />
        <EmuButton
          value={"Step"}
          handleClick={() => onStep()}
        />
        <EmuButton
          value={"Reset"}
          handleClick={() => onEmuReset()}
        />
        <button
          onClick={() => {
            console.log("ASM");
            console.log(asm.getAssembledCode());
            console.log("CPU");
            console.log(cpu.getMemory());
            console.log("REG");
            console.log(data.registers);
            console.log("STATE");
            console.log(data.memory);
          }}>
          Display State
        </button>
      </div>
    </div>
  );
}
