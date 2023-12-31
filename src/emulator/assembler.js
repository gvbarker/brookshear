import opcodes from "./opcodes";
const assembler = class {
  constructor(code = "", ramOnly = false) {
    this.unassembledCode = code.toUpperCase();
    this.labels = {};
    this.assembledCode = [];
    this.OPS = opcodes;
    this.ramOnly = ramOnly;
    this.errorFlag = false;
  }

  setCodeToAssemble(code) {
    this.unassembledCode = code.toUpperCase();
  }

  getAssembledCode() {
    return this.assembledCode;
  }

  reset() {
    this.errorFlag = false;
    this.assembledCode = [];
    this.labels = {};
  }

  assemble() {
    let codeArray = this.unassembledCode.split("\n");
    codeArray = this.#stripCommentsAndEmpties(codeArray);
    codeArray = this.#labelPass(codeArray);
    this.#instructionPass(codeArray);
  }

  #stripCommentsAndEmpties(codeArray) {
    const cleanedCodeArray = [];
    for (let i = 0; i < codeArray.length; i++) {
      const commentStartIndex = codeArray[i].indexOf(";");
      if (commentStartIndex > -1) {
        codeArray[i] = codeArray[i].slice(0, commentStartIndex);
      }
      const trimmedLine = codeArray[i].trim();
      if (trimmedLine) {
        cleanedCodeArray.push(trimmedLine);
      }
    }
    return cleanedCodeArray;
  }

  #labelPass(codeArray) {
    let location = 0;
    const deLabeledCode = [];
    for (const line of codeArray) {
      if (line.includes(":")) {
        this.#addValidLabel(line, location);
        continue;
      }
      location += 2;
      deLabeledCode.push(line);
    }
    return deLabeledCode;
  }
  #addValidLabel(label, location) {
    label = label.split(":");
    const syntaxChecks = {
      [`Cannot have characters after label declaration: ${label}`]:
        label.length > 2 || label[1].length,
      [`Cannot have blank label: ${label}`]: !label[0],
      [`Cannot have spaces in label declaration: ${label}`]:
        label[0].search(" ") > -1,
      [`Cannot have duplicate labels: ${label}`]: label[0] in this.labels,
    };
    this.#handleSyntaxErrors(syntaxChecks);
    label = label[0];
    location = location.toString(16).toUpperCase();
    while (location.length < 2) {
      location = "0" + location;
    }
    this.labels[label] = location;
  }

  #getValidOperands(operands) {
    const validOperands = [];
    for (const operand of operands) {
      if (operand[0] === "R") {
        validOperands.push(this.#getValidRegister(operand));
        continue;
      }
      validOperands.push(this.#getValidNumeric(operand));
    }
    return validOperands;
  }
  #getValidRegister(reg) {
    reg = reg.trim();
    const syntaxChecks = {
      [`Accessed invalid register "${reg}"`]: !reg || reg.length > 2,
    };
    this.#handleSyntaxErrors(syntaxChecks);
    return reg.slice(1);
  }
  #getValidNumeric(num) {
    num = num.trim();
    try {
      if (num in this.labels) {
        return this.labels[num];
      }
      if (!num || num.length > 3)
        throw new Error(`Accessed invalid value "${num}"`);
      return num.slice(1, 3);
    } catch (err) {
      this.#handleErrors(err);
      return;
    }
  }

  #instructionPass(codeArray) {
    const syntaxChecks = {
      ["You have exceeded the number of allowed commands for all-RAM assembly."]:
        this.ramOnly && this.assembledCode.length > 256,
      ["You have exceeded the number of allowed commands for auxiliary-included assembly."]:
        !this.ramOnly && this.assembledCode.length > 35,
    };
    this.#handleSyntaxErrors(syntaxChecks);
    for (const line of codeArray) {
      const count = line.split(",").length - 1;
      const operation = this.#getOperation(line);
      switch (count) {
        case 2:
          this.#handleThreeOps(operation, line);
          break;
        case 1:
          this.#handleTwoOps(operation, line);
          break;
        case 0:
          this.#handleNoOp(operation, line);
          break;
        default:
          this.#handleErrors("Something went wrong...");
          return;
      }
    }
  }
  #handleThreeOps(op, line) {
    const hasImm = line.indexOf("#") > -1;
    const hasAddr = line.indexOf("$") > -1;
    const syntaxChecks = {
      [`Invalid operand usage for operation "${op}"`]: hasImm || hasAddr,
    };
    this.#handleSyntaxErrors(syntaxChecks);
    let regs = line.slice(line.indexOf("R", 3), line.length);
    regs = this.#getValidOperands(regs.split(","));
    this.assembledCode.push({
      cellVal: this.OPS[op] + regs[0],
      cellColor: "bg-green-300",
    });
    this.assembledCode.push({
      cellVal: regs[1] + regs[2],
      cellColor: "bg-green-300",
    });
  }
  #handleTwoOps(op, line) {
    const hasImm = line.indexOf("#") > -1;
    const hasAddr = line.indexOf("$") > -1;
    const registerRegex = /(r([0-9]|[a-f]|[A-F]))/gi;
    const registerCount = [...line.matchAll(registerRegex)].length;
    const syntaxChecks = {
      [`Invalid usage of immediate value for operation "${op}"`]:
        hasImm && !this.OPS.imms.includes(op),
      [`Invalid order of immediate value for operation "${op}"`]:
        hasImm && line.indexOf("#") < line.indexOf("R", 3),
      [`Invalid number of registers for operation "${op}"`]:
        this.OPS.imms.includes(op) && registerCount > 1,

      [`Invalid usage of memory address for operation "${op}"`]:
        hasAddr && !this.OPS.addrs.includes(op),
      [`Invalid order of immediate value for operation "${op}"`]:
        hasAddr && line.indexOf("$") < line.indexOf("R", 3),
      [`Invalid number of registers for operation "${op}"`]:
        this.OPS.addrs.includes(op) && registerCount > 1,
    };

    this.#handleSyntaxErrors(syntaxChecks);
    let operands = line.slice(line.indexOf("R", 3), line.length);
    operands = this.#getValidOperands(operands.split(","));
    if (op === "ROR") {
      this.assembledCode.push({
        cellVal: this.OPS[op] + operands[0],
        cellColor: "bg-green-300",
      });
      this.assembledCode.push({
        cellVal: "0" + operands[1],
        cellColor: "bg-green-300",
      });
      return;
    }
    if (op === "CPY") {
      this.assembledCode.push({
        cellVal: this.OPS[op] + "0",
        cellColor: "bg-green-300",
      });
      this.assembledCode.push({
        cellVal: operands[0] + operands[1],
        cellColor: "bg-green-300",
      });
      return;
    }
    this.assembledCode.push({
      cellVal: this.OPS[op] + operands[0],
      cellColor: "bg-green-300",
    });
    this.assembledCode.push({
      cellVal: operands[1],
      cellColor: "bg-green-300",
    });
  }

  #handleNoOp(op, line) {
    const syntaxChecks = { [`Invalid usage of ${op}`]: line.trim() !== "HLT" };
    this.#handleSyntaxErrors(syntaxChecks);
    this.assembledCode.push({
      cellVal: this.OPS[op] + "0",
      cellColor: "bg-green-300",
    });
    this.assembledCode.push({
      cellVal: "00",
      cellColor: "bg-green-300",
    });
  }
  #getOperation(line) {
    const operationRegex = /([A-Z]{3}|[A-Z][a-z]{2}|[a-z]{3})/;
    const operation = operationRegex.exec(line);
    const syntaxChecks = {
      [`No operation found in line ${line}`]: !operation,
      [`Invalid operation in line ${line}`]: !(
        operation && operation[0] in this.OPS
      ),
    };
    this.#handleSyntaxErrors(syntaxChecks);
    return operation[0];
  }

  #handleSyntaxErrors(err) {
    for (const msg in err) {
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
    this.reset();
    throw new Error("Error in assembly, stopping script.");
  }
};
export default assembler;
