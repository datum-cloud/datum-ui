import type { ColumnDef } from '@tanstack/react-table'
import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import type { Post } from '../helpers/mock-data'
import { DataTable } from '@datum-cloud/datum-ui/data-table'

const postColumns: ColumnDef<Post>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTable.ColumnHeader column={column} title="ID" />,
    size: 80,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTable.ColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: 'body',
    header: 'Body',
    cell: ({ row }) => (
      <span className="line-clamp-1 max-w-md">{row.original.body}</span>
    ),
  },
  {
    accessorKey: 'userId',
    header: 'Author',
    cell: ({ row }) => (
      <span>
        User
        {row.original.userId}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTable.RowActions
        row={row}
        actions={[
          {
            label: 'View',
            onClick: () => alert(`Post #${row.original.id}: ${row.original.title}`),
          },
          {
            label: 'Delete',
            variant: 'destructive',
            onClick: () => alert(`Delete post #${row.original.id}`),
          },
        ]}
      />
    ),
  },
]

const meta: Meta = {
  title: 'Features/DataTable/Server',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <DataTable.Server
      columns={postColumns}
      limit={10}
      getRowId={(row: Post) => String(row.id)}
      fetchFn={async (args) => {
        const start = args.cursor ? Number(args.cursor) : 0
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${args.limit}`,
        )
        return res.json()
      }}
      transform={(posts: Post[]) => {
        const start = posts.length > 0 ? (posts[0]?.id ?? 1) - 1 : 0
        const nextStart = start + posts.length
        return {
          data: posts,
          cursor: nextStart < 100 ? String(nextStart) : undefined,
          hasNextPage: posts.length === 10 && nextStart < 100,
        }
      }}
    >
      <div className="flex flex-col gap-4">
        <DataTable.Search placeholder="Search posts..." />
        <DataTable.ActiveFilters />
        <DataTable.Content emptyMessage="No posts found." />
        <DataTable.Pagination />
      </div>
    </DataTable.Server>
  ),
}
