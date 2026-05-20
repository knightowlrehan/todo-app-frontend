"use client";

import { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`text-sm font-medium text-slate-700 ${className}`}
      {...props}
    />
  );
}

export default Label;