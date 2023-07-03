let assembler = class {
  constructor(code) {
    this.unassembledCode = code;
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
    }
    this.threeOperandOperations = ["ADD", "SUB", "IOR", "AND", "XOR"];


    

  }

  setCodeToAssemble(code) {
    let self = this
    self.unassembledCode = code
  }

  assemble() {
    let self = this
    let codeLineArray = self.unassembledCode.split("\n");
    codeLineArray = this.stripComments(codeLineArray);
    for (let i = 0; i < codeLineArray.length(); i++) {
      console.log(self.getOperation(i, ))
    }
    //codeLineArray = this.convertLines(codeLineArray);
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

  validateLabel() {
    console.log(" ");
  }

  getOperation(line, lineNumber) {
    let self = this
    const operationRegex = /([A-Z]{3}|[A-Z][a-z]{2}|[a-z]{3})/
    let searchReturn = operationRegex.exec(line);
    try {
      if (!searchReturn) throw `No operation found in line ${lineNumber}`
      const opCheck = searchReturn[0].toUpperCase() in self.allOperations 
      if (!opCheck) throw `Invalid operation in line ${lineNumber}`
    }
    catch(err) {
      alert(err);
    }
    return searchReturn[0].toUpperCase()
  }

  pad() {
    console.log("fuck");
  }
}
export default assembler