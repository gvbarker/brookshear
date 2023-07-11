import { TextField } from "@mui/material";
import React from "react";

export default function InputBox(val, onChange) {
  return (
    <TextField
      multiline
      placeholder = "Assembly..."
      rows = { 25 }
     
    />
  );
}