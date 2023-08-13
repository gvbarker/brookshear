import opcodes from "./opcodes";
//TODO: ADD USER ERROR HANDLING
//TODO: WORK IN PROG COUNTER TO EXTERIOR COMPONENTS FOR FREQUENCY
//TODO: FLAGS(?)
//TODO: ADD CHECK FOR BEQ TO ENSURE JUMP IS MADE TO EVEN NUMBERED DATA CELL
const cpu = class {
  constructor(memory = [], ramOnly = true) {
    this.progMem = memory;
    this.returnMem = memory;
    this.ramOnly = ramOnly;
    this.registers = Array.from({ length: 16 }, () => ({
      regVal: 0,
      regColor: "bg-white",
    }));
    this.iPointer = 0;
    this.stop = false;
    this.freqDelay = 0;
  }

  reset() {
    this.stop = false;
    this.iPointer = 0;
    this.errorFlag = false;
    this.registers = Array.from({ length: 16 }, () => ({
      regVal: 0,
      regColor: "bg-white",
    }));
    this.returnMem = this.progMem;
  }
  resetColors() {
    const newCells = this.returnMem.slice();
    const newRegs = this.registers.slice();
    for (let i = 0; i < newCells.length; i++) {
      newCells[i].cellColor = "bg-white";
    }
    for (let i = 0; i < newRegs.length; i++) {
      newRegs[i].regColor = "bg-white";
    }
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
  #pad(cellToPad) {
    while (cellToPad.length < 2) {
      cellToPad = "0" + cellToPad;
    }
    return cellToPad;
  }
  #execArithmeticOp(op1, op2, result, operation) {
    const resultReg = parseInt(result, 16);
    const opReg1 = parseInt(op1, 16);
    const opReg2 = parseInt(op2, 16);
    const operand1 = this.registers[opReg1].regVal;
    const operand2 = this.registers[opReg2].regVal;
    let opresult;
    switch (operation) {
      case "+":
        opresult = operand1 + operand2;
        if (opresult > 0xFF) {
          opresult %= 0x100;
        }
        break;
      case "-":
        opresult = operand2 - operand1;
        if (opresult < 0) {
          opresult = 0;
        }
        break;
      case "|":
        opresult = operand1 | operand2;
        break;
      case "&":
        opresult = operand1 & operand2;
        break;
      case "^":
        opresult = operand1 ^ operand2;
        break;
      default:
        opresult = "00";
        break;
    }
    this.registers[resultReg] = {
      regVal: opresult,
      regColor: "bg-amber-300",
    };
  }
  #handleInstruction(instr, param) {
    switch (instr[0]) {
      case opcodes["LDR"]: {
        const reg = parseInt(instr[1], 16);
        const addr = parseInt(param, 16);
        const valAtAddr = parseInt(this.returnMem[addr].cellVal, 16);
        this.registers[reg] = {
          regVal: valAtAddr,
          regColor: "bg-amber-300",
        };
        break;
      }
      case opcodes["MOV"]: {
        const reg = parseInt(instr[1], 16);
        const immediate = parseInt(param, 16);
        this.registers[reg] = {
          regVal: immediate,
          regColor: "bg-amber-300",
        };
        break;
      }
      case opcodes["STR"]: {
        const reg = parseInt(instr[1], 16);
        const addr = parseInt(param, 16);
        const val = this.#pad(this.registers[reg].regVal.toString(16));
         
        this.returnMem[addr] = {
          cellVal: val.toUpperCase(),
          cellColor: "bg-amber-300",
        };
        break;
      }
      case opcodes["CPY"]: {
        const reg1 = parseInt(param[0], 16);
        const reg2 = parseInt(param[1], 16);
        this.registers[reg1] = {
          regVal: this.registers[reg2].regVal,
          regColor: "bg-amber-300",
        };
        break;
      }
      case opcodes["ROT"]: {
        const reg = parseInt(instr[1], 16);
        const numRot = parseInt(param[1], 16);
        const val = this.registers[reg].regVal;
        this.registers[reg] = {
          regVal: (val << numRot) | (val >>> (8 - numRot)),
          regColor: "bg-amber-300",
        };
        this.registers[reg].regVal = (val << numRot) | (val >>> (8 - numRot));
        break;
      }
      case opcodes["BEQ"]: {
        const reg = parseInt(instr[1], 16);
        this.registers[reg] = {
          regVal: this.registers[reg].regVal,
          regColor: "bg-amber-300"
        };
        this.registers[0] = {
          regVal: this.registers[0].regVal,
          regColor: "bg-amber-300"
        }
        
        if (this.registers[reg].regVal === this.registers[0].regVal) {
          const addr = parseInt(param, 16);
          //subtracting 2 to counterbalance the incrementing I-pointer after instruction completes
          this.iPointer = addr-2;
        }
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
        this.returnMem[this.iPointer].cellColor = "bg-red-500";
        this.returnMem[this.iPointer + 1].cellColor = "bg-red-500";
        this.stop = true;
        return;
    }
  }
  #runInstruction() {
    if (this.iPointer >= 0xFE) {
      this.returnMem[this.iPointer].cellColor = "bg-red-500";
      this.returnMem[this.iPointer + 1].cellColor = "bg-red-500";
      this.stop = true;
      return;
    }
    const instr = this.returnMem[this.iPointer].cellVal;
    const params = this.returnMem[this.iPointer + 1].cellVal;
    this.returnMem[this.iPointer].cellColor = "bg-green-500";
    this.returnMem[this.iPointer + 1].cellColor = "bg-green-500";
    this.#handleInstruction(instr, params);
  }
  step() {
    if (this.stop) {
      return false;
    }
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
