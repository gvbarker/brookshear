let assembler = class {
  constructor(code="") {
    this.unassembledCode = code;
    this.labels = {};
    this.assembledCode = [];
    this.ops = {
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
      "threeOperandOps":["ADD", "SUB", "IOR", "AND", "XOR"],
      "twoOperandOps":["LDR", "STR", "MOV", "ROR", "BEQ"],
      "oneOperandOps":["HLT"],
      "immediateOps":["LDR", "ROR"],
      "addressOps":["LDR", "STR", "BEQ"]
    };
    this.errorFlag = false; 
  }

  setCodeToAssemble(code) { this.unassembledCode = code }

  getAssembledCode() { return (this.assembledCode); }

  reset() {
    this.errorFlag = false;
    this.assembledCode = [];
    this.labels = {}
  }

  assemble() {
    let codeArray = this.unassembledCode.split("\n");
    codeArray = this.#stripCommentsAndEmptyLines(codeArray);
    codeArray = this.#passForLabels(codeArray);
    this.#passForInstructions(codeArray);
  }

  #passForLabels(codeArray) {
    let self = this
    function getValidatedLabel(line) {
      line = line.split(":");
      let labelError = `Invalid label: ${line}`
      try { 
        if (line.length > 2  || line[1].length) throw labelError;
        if (!line[0]) throw labelError;
        if (line[0].search(" ") > -1) throw labelError;
        return line[0].toUpperCase();
      }
      catch(err) {
        self.#handleErrors(err);
      }
    }

    function addNewLabel(label, location) {
      try{
        if (label in self.labels) throw `Duplicate label: ${label}`;
        location = location.toString();
        while (location.length < 2) { location = "0" + location; }
        self.labels[label] = location;
      }
      catch(err) {
        self.#handleErrors(err);
      }
    }

    let location = 0;
    let labelStrippedCodeArray = [];
    for (let i = 0; i < codeArray.length; i++) {
      if (this.errorFlag) { 
        return 
      }
      if (codeArray[i].includes(":")) { 
        const newLabel = getValidatedLabel(codeArray[i], i) 
        addNewLabel(newLabel, location, i);
        continue;
      }
      location += 2; 
      labelStrippedCodeArray.push(codeArray[i]);
    }
    return labelStrippedCodeArray;
  }
 
  #stripCommentsAndEmptyLines(codeArray) {
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
  
  #passForInstructions(codeArray) {
    let self = this
    function getValidatedOperands(operands) {
      let validatedOperands = []
      for (let i = 0; i < operands.length; i++) {
        if (operands[i].slice(0) === "R") {
          validatedOperands.push(getValidRegister(operands[i]));
        }
        else {
          validatedOperands.push(getValidNumeric(operands[i]));  
        }
      }
      return (validatedOperands); 
    }

    function getValidRegister(register) {
      register = register.trim()
      try {
        if (!register || register.length > 2) throw `Accessed invalid register "${register}"`;
        return (register.slice(1));
      } 
      catch (err) {
        self.#handleErrors(err)
        return
      }
    }

    function getValidNumeric(numeric) {
      numeric = numeric.trim()
      try {
        if (!numeric || numeric.length > 3) throw `Accessed invalid numeric value "${numeric}"`;
        return (numeric.slice(1,3));
      } 
      catch (err) {
        if (numeric in self.labels) { return (self.labels[numeric]); }
        self.#handleErrors(err)
        return
      }
    }

    function handleThreeOperandOperation(op, line) {
      try{
        const hasImmediate =  (line.indexOf("#") > -1);
        const hasMemAddr = (line.indexOf("$") > -1);
        if (hasImmediate || hasMemAddr) throw `Invalid operand usage for operation "${op}"`;
        
        let regs = line.slice(line.indexOf("R", 3), line.length);
        regs = getValidatedOperands(regs.split(","));
        self.assembledCode.push(self.ops[op] + regs[0]);
        self.assembledCode.push(regs[1] + regs[2]);
      }
      catch(err) {
        self.#handleErrors(err);
        return;
      }
    }

    function handleTwoOperandOperation(op, line) {
      try {
        const hasImmediate =  (line.indexOf("#") > -1);
        const hasMemAddr = (line.indexOf("$") > -1);
        const immediateError = `Invalid usage of immediate value for operation "${op}"`;

        const memAddrError = `Invalid usage of memory address for operation "${op}"`;
        console.log(line)        
        if (hasImmediate && !self.ops.immediateOps.includes(op)) throw immediateError;
        if (hasImmediate && line.indexOf("#") < line.indexOf("R", 3)) throw immediateError;
        if (self.ops.immediateOps.includes(op) && [...line.matchAll(/(r([0-9]|[a-f]|[A-F]))/gi)].length > 1) throw immediateError

        if (hasMemAddr && !self.ops.addressOps.includes(op)) throw memAddrError;
        if (hasMemAddr && line.indexOf("$") < line.indexOf("R", 3)) throw memAddrError; 
        if (self.ops.addressOps.includes(op) && [...line.matchAll(/(r([0-9]|[a-f]|[A-F]))/gi)].length > 1) throw memAddrError
        let operands = line.slice(line.indexOf("R", 3), line.length);
        operands = getValidatedOperands(operands.split(","));
        if (op === "LDR" && hasMemAddr) { 
          self.assembledCode.push(self.ops[op] + operands[0]);
          self.assembledCode.push(operands[1]);
          return;
        }
        if (op === "LDR" && hasImmediate) { 
          self.assembledCode.push(0x2 + operands[0]);
          self.assembledCode.push(operands[1]);
          return;
        }
        if (op === "MOV") {
          self.assembledCode.push(self.ops[op] + "0");
          self.assembledCode.push(operands[0] + operands[1]);
          return
        }
        if (op === "ROR") {
          self.assembledCode.push(self.ops[op] + operands[0]);
          self.assembledCode.push("0" + operands[1]);
          return;
        }
        if (op === "BEQ") {
          self.assembledCode.push(self.ops[op] + operands[0]);
          self.assembledCode.push(operands[1]);
          return;
        }

        self.assembledCode.push(self.ops[op] + operands[0]);
        self.assembledCode.push(operands[1] + operands[2]);

      }
      catch (err) {
        self.#handleErrors(err);
        return;
      }
    }

    function handleSingleOperandOperation(op, line) {
      try {
        if (line.trim() !== "HLT") throw `Invalid usage of ${op}`; 
        self.assembledCode.push(self.ops[op] + "0");
        self.assembledCode.push("00");
      }
      catch(err) {
        self.#handleErrors(err);
        return
      }
    }

    for (let i = 0; i < codeArray.length; i++) {
      if (this.errorFlag) { return; }
      let count = codeArray[i].split(",").length-1;
      const operation = this.#getOperation(codeArray[i], i);
      switch(count) {
      case 2: {
        handleThreeOperandOperation(operation, codeArray[i].toUpperCase(), i);
        break;
      }
      case 1: {
        handleTwoOperandOperation(operation, codeArray[i].toUpperCase(), i);
        break;
      }
      case 0:
        handleSingleOperandOperation(operation, codeArray[i].toUpperCase(), i);
        break
      default:
        this.#handleErrors("Something went wrong...");
        return
      }
    }
  }

  #getOperation(line) {
    const operationRegex = /([A-Z]{3}|[A-Z][a-z]{2}|[a-z]{3})/
    let searchReturn = operationRegex.exec(line);
    try {
      if (!searchReturn) throw `No operation found in line ${line}`
      const opCheck = searchReturn[0].toUpperCase() in this.ops 
      if (!opCheck) throw `Invalid operation in line ${line}`
    }
    catch(err) {
      this.#handleErrors(err)
    }
    return searchReturn[0].toUpperCase();
  }

  #handleErrors(err) {
    alert(err);
    this.errorFlag = true;
    this.reset()
    throw new Error("Error in assembly, stopping.");
  }

}
export default assembler