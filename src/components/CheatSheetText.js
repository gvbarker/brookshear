import React from "react";

export default function CheatSheetText({ text }) {
  return (
    <td className="p-1">
      <p className="text-sm text-slate-100">{text}</p>
    </td>
  );
}
