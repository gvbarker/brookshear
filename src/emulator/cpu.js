import opcodes from "./opcodes";
//TODO: ADD FLAGS, ADD USER ERROR HANDLING
//TODO: WORK IN PROG COUNTER TO EXTERIOR COMPONENTS FOR FREQUENCY
const cpu = class {
  constructor(memory = [], ramOnly = true) {
    this.progMem = memory;
    this.returnMem = memory;
    this.ramOnly = ramOnly;
    this.registers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.iPointer = 0;
    this.errorFlag = false;
    this.freqDelay = 0;
  }

  reset() {
    this.iPointer = 0;
    this.errorFlag = false;
    this.registers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.returnMem = this.progMem;
  }
  setRamOnly(val) {
    this.ramOnly = val;
  }
  setProg(program = []) {
    this.progMem = program;
    this.reset();
  }
  getMemory() {
    return this.returnMem;
  }
  getRegisterStatus() {
    return this.registers;
  }
  #execArithmeticOp(op1, op2, result, operation) {
    const resultReg = parseInt(result, 16);
    const opReg1 = parseInt(op1, 16);
    const opReg2 = parseInt(op2, 16);
    let opresult;
    switch (operation) {
      case "+":
        opresult = this.registers[opReg1] + this.registers[opReg2];
        break;
      case "-":
        opresult = this.registers[opReg2] - this.registers[opReg1];
        break;
      case "|":
        opresult = this.registers[opReg1] | this.registers[opReg2];
        break;
      case "&":
        opresult = this.registers[opReg1] & this.registers[opReg2];
        break;
      case "^":
        opresult = this.registers[opReg1] ^ this.registers[opReg2];
        break;
    }
    opresult = opresult.toString(16);
    while (opresult.length < 2) {
      opresult = "0" + opresult;
    }
    this.registers[resultReg] = opresult.toUpperCase();
  }
  #handleInstruction(instr, param) {
    switch (instr[0]) {
      case opcodes["LDR"]: {
        const reg = parseInt(instr[1], 16);
        const addr = parseInt(param, 16);
        const valAtAddr = parseInt(this.returnMem[addr], 16);
        this.registers[reg] = valAtAddr;
        break;
      }
      case "2": {
        const reg = parseInt(instr[1], 16);
        const immediate = parseInt(param, 16);
        this.registers[reg] = immediate;
        break;
      }
      case opcodes["STR"]: {
        const reg = parseInt(instr[1], 16);
        const addr = parseInt(param, 16);
        this.returnMem[addr] = this.registers[reg];
        break;
      }
      case opcodes["MOV"]: {
        const reg1 = parseInt(param[0], 16);
        const reg2 = parseInt(param[1], 16);
        this.registers[reg1] = this.registers[reg2];
        break;
      }
      case opcodes["ROT"]: {
        const reg = parseInt(instr[1], 16);
        const numRot = parseInt(param[1], 16);
        const val = this.registers[reg];
        this.registers[reg] = (val << numRot) | (val >>> (8 - numRot));
        break;
      }
      case opcodes["BEQ"]: {
        const reg = parseInt(instr[1], 16);
        if (!this.registers[reg]) {
          break;
        }
        const addr = parseInt(param, 16);
        this.iPointer = addr;
        break;
      }
      case opcodes["ADD"]: {
        this.#execArithmeticOp(param[0], param[1], instr[1], "+");
        break;
      }
      case opcodes["SUB"]: {
        this.#execArithmeticOp(param[0], param[1], instr[1], "-");
        break;
      }
      case opcodes["IOR"]: {
        this.#execArithmeticOp(param[0], param[1], instr[1], "|");
        break;
      }
      case opcodes["AND"]: {
        this.#execArithmeticOp(param[0], param[1], instr[1], "&");
        break;
      }
      case opcodes["XOR"]: {
        this.#execArithmeticOp(param[0], param[1], instr[1], "^");
        break;
      }
      case opcodes["HLT"]:
        return;
    }
  }
  #runInstruction() {
    const instr = this.returnMem.cellVal[this.iPointer];
    const params = this.returnMem[this.iPointer + 1];
    this.#handleInstruction(instr, params);
  }
  step() {
    this.#runInstruction();
    this.iPointer += 2;
  }
  run() {
    for (
      this.iPointer;
      this.iPointer < this.progMem.length;
      this.iPointer += 2
    ) {
      this.#runInstruction();
    }
  }
};
export default cpu;
