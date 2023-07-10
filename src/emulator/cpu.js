import opcodes from "./opcodes";
//TODO: ADD FLAGS, ADD USER ERROR HANDLING
let cpu = class{
  constructor(memory, ramOnly = true) {
    this.startingMem = memory;
    this.returnMem = [];
    this.ramOnly = ramOnly;
    this.registers = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
    this.instrPointer = 0;
    this.errorFlag = false;
    this.freqDelay = 0;
  }

  setRamOnly(val) { this.ramOnly = val; }
  setProg(program) {
    //checks for program matching proper length (all ram vs aux included)
  }
  getNewMem() { return this.startingMem; }
  run() {
   
    for (let i=0; i < this.startingMem.length; i+=2) {
      const instr = this.startingMem[i];
      const params = this.startingMem[i+1];
      switch(instr[0]) {
      case opcodes["LDR"]: {
        const reg = parseInt(instr[1], 16);
        const addr = parseInt(params, 16);
        const valAtAddr = parseInt(this.startingMem[addr], 16);
        this.registers[reg] = valAtAddr;
        break;
      }
      case "2": { 
        const reg = parseInt(instr[1], 16);
        const immediate = parseInt(params, 16);
        this.registers[reg] = immediate;
        break;
      }
      case opcodes["STR"]: {
        const reg = parseInt(instr[1], 16);
        const addr = parseInt(params, 16);
        this.startingMem[addr] = this.registers[reg];
        break;
      }
      case opcodes["MOV"]: {
        const reg1 = parseInt(params[0], 16);
        const reg2 = parseInt(params[1], 16);
        this.registers[reg1] = this.registers[reg2];
        break;
      }
      case opcodes["ADD"]: {
        const resReg = parseInt(instr[1], 16);
        const opReg1 = parseInt(params[0], 16);
        const opReg2 = parseInt(params[1], 16);
        let result = (this.registers[opReg1] + this.registers[opReg2]).toString(16); 
        while (result.length < 2) { result = "0" + result; }
        this.registers[resReg] = result; 
        break;
      }
      case opcodes["SUB"]: {
        const resReg = parseInt(instr[1], 16);
        const opReg1 = parseInt(params[0], 16);
        const opReg2 = parseInt(params[1], 16);
        let result = (this.registers[opReg1] - this.registers[opReg2]).toString(16); 
        while (result.length < 2) { result = "0" + result; }
        this.registers[resReg] = result;
        break;
      }
      case opcodes["IOR"]: {
        const resReg = parseInt(instr[1], 16);
        const opReg1 = parseInt(params[0], 16);
        const opReg2 = parseInt(params[1], 16);
        this.registers[resReg] = this.registers[opReg1] | this.registers[opReg2]; 
        break;
      }
      case opcodes["AND"]: {
        const resReg = parseInt(instr[1], 16);
        const opReg1 = parseInt(params[0], 16);
        const opReg2 = parseInt(params[1], 16);
        this.registers[resReg] = this.registers[opReg1] & this.registers[opReg2];
        break;
      }
      case opcodes["XOR"]: {
        const resReg = parseInt(instr[1], 16);
        const opReg1 = parseInt(params[0], 16);
        const opReg2 = parseInt(params[1], 16);
        this.registers[resReg] = this.registers[opReg1] ^ this.registers[opReg2];
        break;
      }
      case opcodes["ROT"]: {
        const reg = parseInt(instr[1], 16);
        const numRot = parseInt(params[1], 16);
        const val = this.registers[reg];
        this.registers[reg] = (val << numRot) | (val >>> (8 - numRot)); 
        break;
      }
      case opcodes["BEQ"]: {
        const reg = parseInt(instr[1], 16);
        if (!this.registers[reg]) { break; }
        const addr = parseInt(params, 16);
        i=addr;
        break;
      }
      case opcodes["HLT"]:
        return (this.startingMem);
      }
    }
  }
};
export default cpu;