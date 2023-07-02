let assembler = class {
  constructor(code) {
    this.code = code;
    this.assembledCode = []
  }
  assemble() {
    let self = this
    let codeLineArray = self.code.split("\n");
    codeLineArray = this.stripComments(codeLineArray);
  }
  stripComments(codeArray) {
    let cleanedCodeArray = [];
    for (let i of codeArray) {
      let line = i.trim();
      const commentStartIndex = line.indexOf(";");
      if (commentStartIndex > -1) {
        line = line.slice(0,commentStartIndex);
      }        
      if (line) {
        cleanedCodeArray.push(line);
      }
    }
    return cleanedCodeArray
  }
  

  pad() {
    console.log("fuck");
  }
}
export default assembler