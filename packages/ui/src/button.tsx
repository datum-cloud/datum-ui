'use client'

import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  appName: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  appName,
}: ButtonProps) => {
  return (
    <button
      className="ui-px-4 ui-py-3 ui-bg-orange-0 ui-rounded-md ui-mt-4 ui-mx-auto ui-text-white"
      onClick={() => alert(appName)}
      type="button"
    >
      {children}
    </button>
  )
}

export default Button
