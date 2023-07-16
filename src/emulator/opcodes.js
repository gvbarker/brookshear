const opcodes = {
  LDR: "1",
  STR: "3",
  MOV: "4",
  ADD: "5",
  SUB: "6",
  IOR: "7",
  AND: "8",
  XOR: "9",
  ROR: "A",
  BEQ: "B",
  HLT: "C",
  threeOps: ["ADD", "SUB", "IOR", "AND", "XOR"],
  twoOps: ["LDR", "STR", "MOV", "ROR", "BEQ"],
  noOps: ["HLT"],
  imms: ["LDR", "ROR"],
  addrs: ["LDR", "STR", "BEQ"],
};
export default opcodes;
