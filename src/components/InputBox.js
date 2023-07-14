import { TextField } from "@mui/material";
import React from "react";

export default function InputBox(val, onChange) {
  return (
    <TextField
      multiline
      placeholder = "Assembly..."
      rows = { 20 }
      className="flex bg-white w-1/3 rounded-lg p-3 overflow-auto"
    />
  );
}