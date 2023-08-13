//TODO: REFACTOR TO INCLUDE OPCODE SYNTAX AND DESCRIPTION IN OPCODE OBJECT
/*
Current Syntax
LDR R, $XY  : Load with bit pattern in cell xy
MOV R, #XY  : Load with bit pattern xy
STR R, $XY  : Store r bit pattern in cell xy
CPY R, S    : Copy bit pattern in register R into register S
ADD R, S, T : Add register s, t, store in r
SUB R, S, T : Sub register s, t, store in r
IOR R, S, T : Inclusive or register s, t, store in r
AND R, S, T : And register s, t, store in r
XOR R, S, T : Exclusive or register s, t, store in r
ROR R, #X   : Rotate bit pattern in r x-times 
BEQ R, $XY  : If r equals 0, change pc to $XY
HLT         : Halt execution
*/
const opcodes = {
  LDR: "1",
  MOV: "2",
  STR: "3",
  CPY: "4",
  ADD: "5",
  SUB: "6",
  IOR: "7",
  AND: "8",
  XOR: "9",
  ROR: "A",
  BEQ: "B",
  HLT: "C",
  threeOps: ["ADD", "SUB", "IOR", "AND", "XOR"],
  twoOps: ["LDR", "MOV", "STR", "CPY", "ROR", "BEQ"],
  noOps: ["HLT"],
  imms: ["MOV", "ROR"],
  addrs: ["LDR", "STR", "BEQ"],
};
export default opcodes;
