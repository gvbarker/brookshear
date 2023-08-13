import testASM from "./testasm";
import assembler from "./assembler";

describe("assembler", () => {
  
  test("Correctly assigns unassembled code", () => {
    const emuASM = new assembler();
    emuASM.setCodeToAssemble(testASM.assemblercode);
    expect(emuASM.unassembledCode)
      .toEqual(testASM.assemblercode.toUpperCase());
  });

  test("Correctly resets", () => {
    const emuASM = new assembler();
    emuASM.setCodeToAssemble(testASM.subByTwos);
    emuASM.assemble();
    emuASM.reset();
    expect(emuASM.assembledCode).toEqual([]);
    expect(emuASM.errorFlag).toBe(false);
    expect(emuASM.labels).toEqual({});
  });
  
  test("Correctly assembles no-label code", () => {
    const correctASM = [
      {"cellColor": "bg-green-300", "cellVal": "20"},
      {"cellColor": "bg-green-300", "cellVal": "80"},
      {"cellColor": "bg-green-300", "cellVal": "21"},
      {"cellColor": "bg-green-300", "cellVal": "FC"},
      {"cellColor": "bg-green-300", "cellVal": "82"},
      {"cellColor": "bg-green-300", "cellVal": "10"},
      {"cellColor": "bg-green-300", "cellVal": "32"},
      {"cellColor": "bg-green-300", "cellVal": "FF"}];
    const emuASM = new assembler();
    emuASM.setCodeToAssemble(testASM.extractBits);
    emuASM.assemble();
    expect(emuASM.getAssembledCode())
      .toEqual(correctASM);
  });

  

});