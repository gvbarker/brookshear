import React from "react";
import InstrP from "./InstrP";
export default function CheatSheet() {
  return (
    <div className="bg-stone-700 rounded-md content-center clear-both items-center p-2">
      
      <InstrP
        text={
          "LDR R,$XY Load register R with the contents of memory cell $XY"
        }
      />
      <InstrP
        text={
          "LDR R,#XY Load register R with the bit pattern #XY"
        }
      />
      <InstrP
        text={
          "STR &ensp; &nbsp; R,$XY &ensp; Store the contents of register R in memory cell $XY"
        }
      />
      <InstrP
        text={
          "MOV &ensp; R,S &emsp; Move (copy) the contents of register R to register S"
        }
      />
      <InstrP
        text={
          "ADD &ensp; R,S,T &ensp; Add registers S and T as integers, result to register R"
        }
      />
      <InstrP
        text={
          "SUB &ensp; &nbsp; R,S,T &ensp; Subtract register S from T as integers, result to register R"
        }
      />
      <InstrP
        text={
          "IOR &ensp; &nbsp; R,S,T &ensp; Bitwise OR registers S and T, result to register R"
        }
      />
      <InstrP
        text={
          "AND &ensp; R,S,T &ensp; Bitwise AND registers S and T, result to register R"
        }
      />
      <InstrP
        text={
          "XOR &ensp; R,S,T &ensp; Bitwise XOR registers S and T, result to register R"
        }
      />
      <InstrP
        text={
          "ROR &ensp; R,#X &ensp; Rotate bit pattern in register R right X times"
        }
      />
      <InstrP
        text={
          "BEQ &ensp; R,$XY &ensp; If register R equals register 0, change PC to $XY"
        }
      />
      <InstrP text={"HLT &ensp; (none) &ensp; Halt execution"} />
    </div>
  );
}
