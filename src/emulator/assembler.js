let assembler = class {
  constructor(code="") {
    this.unassembledCode = code.toUpperCase();
    this.labels = {};
    this.assembledCode = [];
    this.OPS = {
      "LDR":"1",
      "STR":"3",
      "MOV":"4",
      "ADD":"5",
      "SUB":"6",
      "IOR":"7",
      "AND":"8",
      "XOR":"9",
      "ROR":"A",
      "BEQ":"B",
      "HLT":"C",
      "threeOps":["ADD", "SUB", "IOR", "AND", "XOR"],
      "twoOps":["LDR", "STR", "MOV", "ROR", "BEQ"],
      "noOps":["HLT"],
      "imms":["LDR", "ROR"],
      "addrs":["LDR", "STR", "BEQ"]
    };
    this.errorFlag = false; 
  }

  setCodeToAssemble(code) { this.unassembledCode = code.toUpperCase(); }

  getAssembledCode() { return (this.assembledCode); }

  reset() {
    this.errorFlag = false;
    this.assembledCode = [];
    this.labels = {}
  }

  assemble() {
    let codeArray = this.unassembledCode.split("\n");
    codeArray = this.#stripCommentsAndEmpties(codeArray);
    codeArray = this.#labelPass(codeArray);
    this.#instructionPass(codeArray);
  }

  #stripCommentsAndEmpties(codeArray) {
    let cleanedCodeArray = [];
    for (let i = 0; i < codeArray.length; i++) {
      const commentStartIndex = codeArray[i].indexOf(";");
      if (commentStartIndex > -1) { 
        codeArray[i] = codeArray[i].slice(0, commentStartIndex);
      }
      let trimmedLine = codeArray[i].trim()
      if (trimmedLine) {
        cleanedCodeArray.push(trimmedLine);
      }
    }
    return cleanedCodeArray
  }

  #getValidLabel(line) {
    line = line.split(":");
    let labelError = `Invalid label: ${line}`
    try { 
      if (line.length > 2  || line[1].length) throw labelError;
      if (!line[0]) throw labelError;
      if (line[0].search(" ") > -1) throw labelError;
      return line[0].toUpperCase();
    }
    catch(err) {
      this.#handleErrors(err);
    }
  }
  #addLabel(label, location) {
    try{
      if (label in this.labels) throw new Error(`Duplicate label: ${label}`);
      location = location.toString();
      while (location.length < 2) { location = "0" + location; }
      this.labels[label] = location;
    }
    catch(err) {
      this.#handleErrors(err);
    }
  }
  #labelPass(codeArray) {
    let location = 0;
    let labelStrippedCodeArray = [];
    for (let i = 0; i < codeArray.length; i++) {
      if (this.errorFlag) { return }
      if (codeArray[i].includes(":")) { 
        const newLabel = this.#getValidLabel(codeArray[i], i) 
        this.#addLabel(newLabel, location, i);
        continue;
      }
      location += 2; 
      labelStrippedCodeArray.push(codeArray[i]);
    }
    return labelStrippedCodeArray;
  }
 
  #getValidOperands(operands) {
    let validatedOperands = []
    for (let operand of operands) {
      if (operand[0] === "R") {
        validatedOperands.push(this.#getValidRegister(operand))
        continue;
      }
      validatedOperands.push(this.#getValidNumeric(operand));  
    }
    return (validatedOperands); 
  }
  #getValidRegister(reg) {
    reg = reg.trim()
    try {
      console.log(reg)
      if (!reg || reg.length > 2) throw new Error(`Accessed invalid register "${reg}"`);
      return (reg.slice(1));
    } 
    catch (err) {
      this.#handleErrors(err)
      return
    }
  }

  #getValidNumeric(num) {
    num = num.trim()
    try {
      if (!num || num.length > 3) throw new Error(`Accessed invalid value "${num}"`);
      return (num.slice(1,3));
    } 
    catch (err) {
      if (num in this.labels) { return (this.labels[num]); }
      this.#handleErrors(err)
      return
    }
  }


    
  
  
  #handleThreeOps(op, line) {
    try{
      console.log(op, line)
      const hasImm =  (line.indexOf("#") > -1);
      const hasAddr = (line.indexOf("$") > -1);
      if (hasImm || hasAddr) throw new Error(`Invalid operand usage for operation "${op}"`);
      
      let regs = line.slice(line.indexOf("R", 3), line.length);
      regs = this.#getValidOperands(regs.split(","));
      this.assembledCode.push(this.OPS[op] + regs[0]);
      this.assembledCode.push(regs[1] + regs[2]);
    }
    catch(err) {
      this.#handleErrors(err);
      return;
    }
  }

  #handleTwoOps(op, line) {
    try {
      const hasImm =  (line.indexOf("#") > -1);
      const hasAddr = (line.indexOf("$") > -1);
      const immError = `Invalid usage of immediate value for operation "${op}"`;

      const addrError = `Invalid usage of memory address for operation "${op}"`;
      if (hasImm && !this.OPS.imms.includes(op)) throw immError;
      if (hasImm && line.indexOf("#") < line.indexOf("R", 3)) throw immError;
      if (this.OPS.imms.includes(op) && [...line.matchAll(/(r([0-9]|[a-f]|[A-F]))/gi)].length > 1) throw immError

      if (hasAddr && !this.OPS.addrs.includes(op)) throw addrError;
      if (hasAddr && line.indexOf("$") < line.indexOf("R", 3)) throw addrError; 
      if (this.OPS.addrs.includes(op) && [...line.matchAll(/(r([0-9]|[a-f]|[A-F]))/gi)].length > 1) throw addrError
      let operands = line.slice(line.indexOf("R", 3), line.length);
      operands = this.#getValidOperands(operands.split(","));
      if (op === "LDR" && hasAddr) { 
        this.assembledCode.push(this.OPS[op] + operands[0]);
        this.assembledCode.push(operands[1]);
        return;
      }
      if (op === "LDR" && hasImm) { 
        this.assembledCode.push(0x2 + operands[0]);
        this.assembledCode.push(operands[1]);
        return;
      }
      if (op === "MOV") {
        this.assembledCode.push(this.OPS[op] + "0");
        this.assembledCode.push(operands[0] + operands[1]);
        return
      }
      if (op === "ROR") {
        this.assembledCode.push(this.OPS[op] + operands[0]);
        this.assembledCode.push("0" + operands[1]);
        return;
      }
      if (op === "BEQ") {
        this.assembledCode.push(this.OPS[op] + operands[0]);
        this.assembledCode.push(operands[1]);
        return;
      }

      this.assembledCode.push(this.OPS[op] + operands[0]);
      this.assembledCode.push(operands[1] + operands[2]);

    }
    catch (err) {
      this.#handleErrors(err);
      return;
    }
  }

  #handleNoOp(op, line) {
    try {
      if (line.trim() !== "HLT") throw new Error(`Invalid usage of ${op}`); 
      this.assembledCode.push(this.OPS[op] + "0");
      this.assembledCode.push("00");
    }
    catch(err) {
      this.#handleErrors(err);
      return
    }
  }

  #instructionPass(codeArray) {
    for (let i = 0; i < codeArray.length; i++) {
      if (this.errorFlag) { return; }
      let count = codeArray[i].split(",").length-1;
      const operation = this.#getOperation(codeArray[i], i);
      switch(count) {
      case 2: {
        this.#handleThreeOps(operation, codeArray[i]);
        break;
      }
      case 1: {
        this.#handleTwoOps(operation, codeArray[i]);
        break;
      }
      case 0:
        this.#handleNoOp(operation, codeArray[i]);
        break
      default:
        this.#handleErrors("Something went wrong...");
        return
      }
    }
  }

  #getOperation(line) {
    const operationRegex = /([A-Z]{3}|[A-Z][a-z]{2}|[a-z]{3})/
    let operation = operationRegex.exec(line);
    try {
      if (!operation) throw new Error(`No operation found in line ${line}`);
      const opCheck = operation[0].toUpperCase() in this.OPS 
      if (!opCheck) throw new Error(`Invalid operation in line ${line}`);
    }
    catch(err) {
      this.#handleErrors(err)
    }
    return operation[0].toUpperCase();
  }

  #handleSyntaxErrors(err) {
    if (err.condition) {
      alert(err.cond);
      this.errorFlag = true;
      this.reset();
      throw new Error("Error in assembler, stopping script.");
    }
  }

  #handleErrors(err) {
    alert(err);
    this.errorFlag = true;
    this.reset()
    throw new Error("Error in assembly, stopping script.");
  }

}
export default assembler