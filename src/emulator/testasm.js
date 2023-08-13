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
  mov r0, #3d
  mov r1, #ff
  sub r2, r0, r1
  str r2, $ff
  hlt`,

  subByTwos: `
mov r1,#FF 
;get -4
mov r2,#07 ;Load R2 with bit pattern in memory cell $FE
XOR r3,r1,r2 ;XOR R1 with R2, place answer in R3
MOV r4,#01 ;Load R4 with bit pattern #01
ADD r5,r3,r4 ;Add R3 and R4 as ints, store answer in R5
STR r5,$FF ;Store contents of R5 to memory cell $FF

; 8 + -4

mov r6, #08 ;load r6 with 8
add r7, r5, r6
str r7, $ef

HLT`,
  extractBits: `
mov r0, #80
mov r1, #fc
and r2,r1,r0
str r2, $ff`
};


export default testASM;
