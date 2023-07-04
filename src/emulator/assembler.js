let assembler = class {
  constructor(code) {
    this.unassembledCode = code;
    this.labels = {};
    this.assembledCode = [];
    this.operations = {
      "LDR":0x1,
      "MOV":0x2,
      "STR":0x3,
      "CPY":0x4,
      "ADD":0x5,
      "SUB":0x6,
      "IOR":0x7,
      "AND":0x8,
      "XOR":0x9,
      "ROR":0xA,
      "BEQ":0xB,
      "HLT":0xC,
      "threeOperandOperations":["ADD", "SUB", "IOR", "AND", "XOR"],
    };
    this.errorFlag = false; 
  }

  setCodeToAssemble(code) {
    this.unassembledCode = code
  }

  assemble() {
    let codeArray = this.unassembledCode.split("\n");
    codeArray = this.stripCommentsAndEmptyLines(codeArray);
    codeArray = this.passForLabels(codeArray);
    codeArray = this.passForInstructions(codeArray);
    this.reset()
  }

  passForLabels(codeArray) {
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
        self.handleErrors(err);
      }
    }

    function addNewLabel(label, location, lineNumber) {
      try{
        if (label in self.labels) throw `Duplicate label in line ${lineNumber}`;
        self.labels[label] = location;
      }
      catch(err) {
        self.handleErrors(err);
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
 
  stripCommentsAndEmptyLines(codeArray) {
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
  
  passForInstructions(codeArray) {
    let self = this
    function getValidatedRegisters(lineNumber, registers) {
      let validatedRegisters = []
      for (let i = 0; i < registers.length; i++) {
        try {
          if (!registers[i] || registers[i].length > 2) throw `Accessed invalid register "${registers[i]}" in line ${lineNumber}`;
          validatedRegisters.push(parseInt(registers[i].slice(1), 16));
        } 
        catch (err) {
          self.handleErrors(err)
          return
        }
      }
      return (validatedRegisters)
    }

    for (let i = 0; i < codeArray.length; i++) {
      let count = codeArray[i].split(",").length-1;
      const operation = this.getOperation(codeArray[i], i);
      switch(count) {
      case 2:
        try {
          if (!this.operations.threeOperandOperations.includes(operation)) throw `Invalid usage of "${operation}" in line ${i}.`;
          if ((codeArray[i].indexOf("#") > -1) || (codeArray[i].indexOf("$") > -1)) throw `Invalid operand usage for operation "${operation}" in line ${i}`;
          let regs = codeArray[i].slice(codeArray[i].indexOf("r", 3), codeArray[i].length)
          regs = getValidatedRegisters(i, regs.split(","));
          console.log(regs)
        }
        catch(err) {
          this.handleErrors(err)
          return
        }
        break
      case 1:
        break;
      case 0:
        break
      default:
        this.handleErrors(`Something went wrong in line ${i}`);
        return
      }
    }
  }

  getOperation(line, lineNumber) {
    const operationRegex = /([A-Z]{3}|[A-Z][a-z]{2}|[a-z]{3})/
    let searchReturn = operationRegex.exec(line);
    try {
      if (!searchReturn) throw `No operation found in line ${lineNumber}`
      const opCheck = searchReturn[0].toUpperCase() in this.operations 
      if (!opCheck) throw `Invalid operation in line ${lineNumber}`
    }
    catch(err) {
      this.handleErrors(err)
    }
    return searchReturn[0].toUpperCase();
  }

  handleErrors(err) {
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