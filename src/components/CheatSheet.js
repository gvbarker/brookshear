import React from "react";
import CheatSheetText from "./CheatSheetText";
export default function CheatSheet() {
  return (
    <div className="bg-stone-700 border-slate-700 border rounded-md">
      <h1 className="rounded-lg text-white py-2 px-1">ASSEMBLY CHEATSHEET</h1>
      <table>
        <tbody>
          <tr>
            <CheatSheetText text={"INSTR"} />
            <CheatSheetText text={"OPERANDS"} />
            <CheatSheetText text={"RESULT"} />
          </tr>
          <tr>
            <CheatSheetText text={"LDR"} />
            <CheatSheetText text={"R,$XY"} />
            <CheatSheetText
              text={"Load register R with the contents of memory cell $XY"}
            />
          </tr>
          <tr>
            <CheatSheetText text={"MOV"} />
            <CheatSheetText text={"R,#XY"} />
            <CheatSheetText text={"Load register R with the bit pattern #XY"} />
          </tr>
          <tr>
            <CheatSheetText text={"STR"} />
            <CheatSheetText text={"R,$XY"} />
            <CheatSheetText
              text={"Store the contents of register R in memory cell $XY"}
            />
          </tr>
          <tr>
            <CheatSheetText text={"CPY"} />
            <CheatSheetText text={"R,S"} />
            <CheatSheetText
              text={"Copy the contents of register R to register S"}
            />
          </tr>
          <tr>
            <CheatSheetText text={"ADD"} />
            <CheatSheetText text={"R,S,T"} />
            <CheatSheetText
              text={"Add registers S and T as integers, result to register R"}
            />
          </tr>
          <tr>
            <CheatSheetText text={"SUB"} />
            <CheatSheetText text={"R,S,T"} />
            <CheatSheetText
              text={
                "Subtract register S from T as integers, result to register R"
              }
            />
          </tr>
          <tr>
            <CheatSheetText text={"IOR"} />

            <CheatSheetText text={"R,S,T"} />

            <CheatSheetText
              text={"Bitwise OR registers S and T, result to register R"}
            />
          </tr>
          <tr>
            <CheatSheetText text={"AND"} />
            <CheatSheetText text={"R,S,T"} />
            <CheatSheetText
              text={"Bitwise AND registers S and T, result to register R"}
            />
          </tr>
          <tr>
            <CheatSheetText text={"XOR"} />
            <CheatSheetText text={"R,S,T"} />
            <CheatSheetText
              text={"Bitwise XOR registers S and T, result to register R"}
            />
          </tr>
          <tr>
            <CheatSheetText text={"ROR"} />
            <CheatSheetText text={"R,#X"} />
            <CheatSheetText
              text={"Rotate bit pattern in register R right X times"}
            />
          </tr>
          <tr>
            <CheatSheetText text={"BEQ"} />
            <CheatSheetText text={"R,$XY"} />
            <CheatSheetText
              text={"If register R equals register 0, change PC to $XY"}
            />
          </tr>
          <tr>
            <CheatSheetText text={"HLT"} />
            <CheatSheetText text={"(N/A)"} />

            <CheatSheetText text={"Halt execution"} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
