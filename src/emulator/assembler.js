let assembler = class {
  constructor(code) {
    this.unassembledCode = code;
    this.labels = {};
    this.assembledCode = [];
    this.ops = {
      "LDR":0x1,
      "STR":0x3,
      "MOV":0x4,
      "ADD":0x5,
      "SUB":0x6,
      "IOR":0x7,
      "AND":0x8,
      "XOR":0x9,
      "ROR":0xA,
      "BEQ":0xB,
      "HLT":0xC,
      "threeOperandOps":["ADD", "SUB", "IOR", "AND", "XOR"],
      "twoOperandOps":["LDR", "STR", "MOV", "ROR", "BEQ"],
      "oneOperandOps":["HLT"],
      "immediateOps":["LDR", "ROR"],
      "addressOps":["LDR", "STR", "BEQ"]
    };
    this.errorFlag = false; 
  }

  setCodeToAssemble(code) {
    this.unassembledCode = code
  }

  assemble() {
    let codeArray = this.unassembledCode.split("\n");
    codeArray = this.#stripCommentsAndEmptyLines(codeArray);
    codeArray = this.#passForLabels(codeArray);
    codeArray = this.#passForInstructions(codeArray);
    this.reset()
  }

  #passForLabels(codeArray) {
    let self = this
    function getValidatedLabel(line, lineNumber) {
      line = line.split(":");
      let labelError = `Invalid label at ${lineNumber}`
      try { 
        if (line.length > 2  || line[1].length) throw labelError;
        if (!line[0]) throw labelError;
        if (line[0].search(" ") > -1) throw labelError;
        return line[0];
      }
      catch(err) {
        self.#handleErrors(err);
      }
    }

    function addNewLabel(label, location, lineNumber) {
      try{
        if (label in self.labels) throw `Duplicate label in line ${lineNumber}`;
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
    function getValidatedRegisters(lineNumber, registers) {
      let validatedRegisters = []
      for (let i = 0; i < registers.length; i++) {
        try {
          if (!registers[i] || registers[i].length > 2) throw `Accessed invalid register "${registers[i]}" in line ${lineNumber}`;
          validatedRegisters.push(registers[i].slice(1));
        } 
        catch (err) {
          self.#handleErrors(err)
          return
        }
      }
      return (validatedRegisters)
    }

    function handleThreeOperandOperation(op, line, lineNumber) {
      try{
        const hasImmediate =  (line.indexOf("#") > -1);
        const hasMemAddr = (line.indexOf("$") > -1);

        if (hasImmediate || hasMemAddr) throw `Invalid operand usage for operation "${op}" in line ${lineNumber}`;
        
        let regs = line.slice(line.indexOf("R", 3), line.length);
        regs = getValidatedRegisters(lineNumber, regs.split(","));
        
        self.assembledCode.push(self.ops[op] + regs[0]);
        self.assembledCode.push(regs[1] + regs[2]);
      }
      catch(err) {
        self.#handleErrors(err);
        return;
      }
    }

    function handleTwoOperandOperation(op, line, lineNumber) {
      try {
        const hasImmediate =  (line.indexOf("#") > -1);
        const hasMemAddr = (line.indexOf("$") > -1);
        const immediateError = `Invalid usage of immediate value for operation "${op}" in line ${lineNumber}`;
        const memAddrError = `Invalid usage of memory address for operation "${op}" in line ${lineNumber}`;
                
        if (hasImmediate && !self.ops.immediateOps.includes(op)) throw immediateError;
        if (hasImmediate && line.indexOf("#") < line.indexOf("R", 2)) throw immediateError;
        if (hasMemAddr && !self.ops.addressOps.includes(op)) throw memAddrError;
        if (hasMemAddr && line.indexOf("$") < line.indexOf("R", 2)) throw memAddrError; 



      }
      catch (err) {
        self.#handleErrors(err);
        return;
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
        break
      default:
        this.#handleErrors(`Something went wrong in line ${i}`);
        return
      }
    }
    console.log(this.assembledCode)
  }

  #getOperation(line, lineNumber) {
    const operationRegex = /([A-Z]{3}|[A-Z][a-z]{2}|[a-z]{3})/
    let searchReturn = operationRegex.exec(line);
    try {
      if (!searchReturn) throw `No operation found in line ${lineNumber}`
      const opCheck = searchReturn[0].toUpperCase() in this.ops 
      if (!opCheck) throw `Invalid operation in line ${lineNumber}`
    }
    catch(err) {
      this.#handleErrors(err)
    }
    return searchReturn[0].toUpperCase();
  }

  #handleErrors(err) {
    alert(err);
    this.errorFlag = true;
    return;
  }

  reset() {
    this.errorFlag = false;
    this.assembledCode = [];
    this.labels = {}
  }

}
export default assembler