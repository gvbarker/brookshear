import React, { useState } from "react";
import Memory from "./Memory";
import InputBox from "./InputBox";

export default function BoxForm() {
  const [memory, setMemory] = useState(Array(256).fill("00"));
  const [text, setText] = useState("");
  
  return (
    <>
      <Memory data={memory} />
      <InputBox/>
    </>
  );
}