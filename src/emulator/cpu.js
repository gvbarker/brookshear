import opcodes from "./opcodes";
let cpu = class{
  constructor(memory, ramOnly = true) {
    this.startingMem = memory;
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
    console.log("do cool stuff");
    for (let i=0; i < this.memory.length; i+=2) {
      const instr = this.memory[i];
      switch(instr) {
      case opcodes["LDR"]:
        break;
      case opcodes["LDR"]+1:
        break;
      case opcodes["MOV"]:
        break;
      case opcodes["STR"]:
        break;
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
  }
};
export default cpu;