import React from "react";
import { Button } from "@mui/material";
export default function EmuButton({ handleClick, value }) {
  return (
    <Button
      variant = "outlined" 
      onClick = { handleClick }
      className="text-white block flex-none h-16 clear-both align-middle p-2"
    >
      {value}
    </Button>
  )
}