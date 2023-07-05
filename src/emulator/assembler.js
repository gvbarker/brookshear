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

  #addValidLabel(label, location) {
    label = label.split(":");
    const syntaxChecks = {
      [`Cannot have characters after label declaration: ${label}`]: (label.length > 2  || label[1].length),
      [`Cannot have blank label: ${label}`]: (!label[0]),
      [`Cannot have spaces in label declaration: ${label}`]: (label[0].search(" ") > -1),
      [`Cannot have duplicate labels: ${label}`]: (label[0] in this.labels)
    }
    this.#handleSyntaxErrors(syntaxChecks)
    label = label[0];
    location = location.toString();
    while (location.length < 2) { location = "0" + location; }
    this.labels[label] = location;
  }
  
  #labelPass(codeArray) {
    let location = 0;
    let labelStrippedCodeArray = [];
    for (let line of codeArray) {
      if (line.includes(":")) { 
        this.#addValidLabel(line, location);
        continue;
      }
      location += 2; 
      labelStrippedCodeArray.push(line);
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
    const hasImm =  (line.indexOf("#") > -1);
    const hasAddr = (line.indexOf("$") > -1);
    const registerRegex =  /(r([0-9]|[a-f]|[A-F]))/gi;
    const registerCount = [...line.matchAll(registerRegex)].length;
    const syntaxChecks = {
      [`Invalid usage of immediate value for operation "${op}"`]: (hasImm && !this.OPS.imms.includes(op)),
      [`Invalid order of immediate value for operation "${op}"`]: (hasImm && line.indexOf("#") < line.indexOf("R", 3)),
      [`Invalid number of registers for operation "${op}"`]: (this.OPS.imms.includes(op) && registerCount > 1),
    
      [`Invalid usage of memory address for operation "${op}"`]: (hasAddr && !this.OPS.addrs.includes(op)),
      [`Invalid order of immediate value for operation "${op}"`]: (hasAddr && line.indexOf("$") < line.indexOf("R", 3)),
      [`Invalid number of registers for operation "${op}"`]: (this.OPS.addrs.includes(op) && registerCount > 1)
    }
    this.#handleSyntaxErrors(syntaxChecks);
    let operands = line.slice(line.indexOf("R", 3), line.length);
    operands = this.#getValidOperands(operands.split(","));
    switch (op) {
    case "LDR": {
      if (hasAddr) {
        this.assembledCode.push(this.OPS[op] + operands[0]);
        this.assembledCode.push(operands[1]);
        break;
      }
      this.assembledCode.push(0x2 + operands[0]);
      this.assembledCode.push(operands[1]);
      break;
    }
    case "MOV":
      this.assembledCode.push(this.OPS[op] + "0");
      this.assembledCode.push(operands[0] + operands[1]);
      break;
    case "ROR":
      this.assembledCode.push(this.OPS[op] + operands[0]);
      this.assembledCode.push("0" + operands[1]);
      break;
    case "BEQ":
      this.assembledCode.push(this.OPS[op] + operands[0]);
      this.assembledCode.push(operands[1]);
      break;
    default:
      this.assembledCode.push(this.OPS[op] + operands[0]);
      this.assembledCode.push(operands[1] + operands[2]);
    }
    
  }

  #handleNoOp(op, line) {
    const syntaxChecks = { [`Invalid usage of ${op}`]: (line.trim() !== "HLT") };
    this.#handleSyntaxErrors(syntaxChecks)
    this.assembledCode.push(this.OPS[op] + "0");
    this.assembledCode.push("00");
    
  }

  #instructionPass(codeArray) {
    for (let i = 0; i < codeArray.length; i++) {
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
    for (let msg in err) {
      if (err[msg]) {
        alert(msg);
        this.errorFlag = true;
        this.reset();
        throw new Error("Error in assembler, stopping script.");
      }
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