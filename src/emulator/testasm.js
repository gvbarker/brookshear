const testASM = {
  assemblercode: `;3-op functions
group1:
add r1, r2, r1
sub r4, r5, r6 ;testing
ior rA, rB, rC
;2-op functions
group2:
mov r3,r2
ldr r4, $03
ldr r2, #04
;jump functions
group3: 
beq r1,$03
beq r9,group1
hlt`,
  cpucode: `
group1:
  ldr r0, #3d
  ldr r1, #ff
  sub r2, r0, r1
  str r2, $ff
  hlt`,
};
export default testASM;
