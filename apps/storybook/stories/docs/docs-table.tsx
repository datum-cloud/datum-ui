import type { ReactNode } from 'react'

export function DocsTable({ children }: { children: ReactNode }) {
  return (
    <>
      <style>
        {`
        .docs-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 0.875rem;
        }
        .docs-table th,
        .docs-table td {
          border: 1px solid rgba(128, 128, 128, 0.35);
          padding: 0.5rem 0.75rem;
          text-align: left;
          vertical-align: top;
        }
        .docs-table th {
          font-weight: 600;
        }
      `}
      </style>
      <table className="docs-table">{children}</table>
    </>
  )
}
