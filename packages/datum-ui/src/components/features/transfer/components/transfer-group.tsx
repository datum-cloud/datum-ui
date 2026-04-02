import * as React from 'react'

export interface TransferGroupProps {
  title: string
  children: React.ReactNode
}

export const TransferGroup: React.FC<TransferGroupProps> = ({
  title,
  children,
}) => {
  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
        {title}
      </div>
      {children}
    </div>
  )
}
