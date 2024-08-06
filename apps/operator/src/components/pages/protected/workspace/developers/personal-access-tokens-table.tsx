'use client'

import { useGetPersonalAccessTokensQuery } from '@repo/codegen/src/schema'
import { DataTable } from '@repo/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { TokenAction } from './actions/token-actions'

type TokenNode = {
  __typename?: 'PersonalAccessToken' | undefined
  id: string
  name: string
  description?: string
  expiresAt: string
}

type TokenEdge = {
  __typename?: 'PersonalAccessTokenEdge' | undefined
  node?: TokenNode | null
}

export const PersonalAccessTokenTable = () => {
  const { data: session } = useSession()

  const [{ data, fetching, error }, refetch] = useGetPersonalAccessTokensQuery({
    pause: !session,
  })

  if (fetching) return <p>Loading...</p>
  if (error || !data) return null

  const tokens: TokenNode[] =
    data.personalAccessTokens.edges
      ?.filter((edge): edge is TokenEdge => edge !== null && edge.node !== null)
      .map((edge) => edge.node as TokenNode) || []

  const columns: ColumnDef<TokenNode>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'expiresAt',
      header: 'Expires',
      cell: ({ cell }) =>
        format(new Date(cell.getValue() as string), 'd MMM yyyy'),
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ cell }) => (
        <TokenAction
          tokenId={cell.getValue() as string}
          refetchTokens={refetch}
        />
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={tokens}
      noResultsText="No tokens found"
    />
  )
}
//
