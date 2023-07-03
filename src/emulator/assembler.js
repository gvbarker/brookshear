let assembler = class {
  constructor(code) {
    this.unassembledCode = code;
    this.labels = {};
    this.assembledCode = [];
    this.allOperations = {
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
      "HLT":0xC
    };
    this.threeOperandOperations = ["ADD", "SUB", "IOR", "AND", "XOR"];
    this.errorFlag = false; 
  }

  setCodeToAssemble(code) {
    this.unassembledCode = code
  }

  assemble() {
    let codeLineArray = this.unassembledCode.split("\n");
    codeLineArray = this.stripComments(codeLineArray);
    for (let i = 0; i < codeLineArray.length; i++) {
      const line = codeLineArray[i].trim();
      if (this.errorFlag) { 
        //this.reset()
        return 
      }
      if (line.search(":") > -1) { 
        const newLabel = this.getValidatedLabel(line, i) 
        this.addNewLabel(newLabel);
        continue;
      } 
      this.getOperation(line, i)
    }
    //codeLineArray = this.convertLines(codeLineArray);
  }

  getValidatedLabel(line, lineNumber) {
    line = line.split(":");
    let labelError = `Invalid label at ${lineNumber}`
    try { 
      if (line.length > 2  || line[1].length) throw labelError;
      if (!line[0]) throw labelError;
      if (line[0].search(" ") > -1) throw labelError;
      return line[0];
    }
    catch(err) {
      this.handleErrors(err);
    }
  }

  addNewLabel(label, lineNumber) {
    try{
      if (label in this.labels) throw `Duplicate label in line ${lineNumber}`;
      this.labels[label] = this.assembledCode.length;
    }
    catch(err) {
      this.handleErrors(err);
    }
  }

  stripComments(codeArray) {
    let cleanedCodeArray = [];
    for (let i of codeArray) {
      let line = i.trim();
      const commentStartIndex = line.indexOf(";");
      if (commentStartIndex > -1) {
        line = line.slice(0, commentStartIndex);
      }        
      if (line) {
        cleanedCodeArray.push(line);
      }
    }
    return cleanedCodeArray
  }
  
  convertLines(codeArray) {
    for (let i of codeArray) {

      let count = i.split(",").length-1;
      switch(count) {
      case 2:
        break
      default:
        return

      }
    }
    
  }

  getOperation(line, lineNumber) {
    const operationRegex = /([A-Z]{3}|[A-Z][a-z]{2}|[a-z]{3})/
    let searchReturn = operationRegex.exec(line);
    try {
      if (!searchReturn) throw `No operation found in line ${lineNumber}`
      const opCheck = searchReturn[0].toUpperCase() in this.allOperations 
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
}
export default assembler