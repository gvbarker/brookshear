import opcodes from "./opcodes";
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
      case opcodes["LDR"]+1: { 
        const reg = parseInt(instr[1], 16);
        const immediate = parseInt(params, 16);
        this.registers[reg] = immediate;
        break;
      }
      case opcodes["MOV"]: {
        const reg1 = parseInt(params[0], 16);
        const reg2 = parseInt(params[1], 16);
        this.registers[reg1] = this.registers[reg2];
        break;
      }
      case opcodes["STR"]: {
        const reg = parseInt(instr[1], 16);
        const addr = parseInt(params, 16);
        this.startingMem[addr] = this.registers[reg];
        break;
      }
      case opcodes["CPY"]:
        break;
      case opcodes["ADD"]:
        break;
      case opcodes["SUB"]:
        break;
      case opcodes["IOR"]:
        break;
      case opcodes["AND"]:
        break;
      case opcodes["XOR"]:
        break;
      case opcodes["ROT"]:
        break;
      case opcodes["BEQ"]:
        break;
      case opcodes["HLT"]:
        break;
      }
    }
    console.log(this.registers);
  }
};
export default cpu;