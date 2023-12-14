"use client";

import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  appName: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  appName,
}: ButtonProps) => {
  return (
    <button
      className="ui-px-4 ui-py-8 ui-bg-blue-600"
      onClick={() => alert(appName)}
      type="button"
    >
      {children}
    </button>
  );
};

export default Button;
