import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@datum-cloud/datum-ui/table'

const meta: Meta<typeof Table> = {
  title: 'Base/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          'A low-level semantic table built from composable sub-components for custom table layouts.\n\n'
          + 'Table provides composable HTML table primitives (`Table`, `TableHeader`, `TableBody`, `TableFooter`, '
          + '`TableHead`, `TableRow`, `TableCell`, `TableCaption`) with consistent Datum styling. '
          + 'Use it when you need full control over table markup. All sub-components accept their native '
          + 'HTML element props plus an optional `className` for custom styling.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Table>

const invoices = [
  { invoice: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { invoice: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
  { invoice: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
  { invoice: 'INV005', status: 'Paid', method: 'PayPal', amount: '$550.00' },
]

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic table with header, body, footer, and a caption demonstrating all core sub-components.',
      },
    },
  },
  render: () => (
    <Table>
      <TableCaption>A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(invoice => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$1,750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const WithFooter: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Use `TableFooter` with a spanning `TableCell` to display aggregate values below the body rows.',
      },
    },
  },
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Widget A</TableCell>
          <TableCell>10</TableCell>
          <TableCell className="text-right">$25.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Widget B</TableCell>
          <TableCell>5</TableCell>
          <TableCell className="text-right">$15.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">$40.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const WithCaption: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Add a `TableCaption` to give the table an accessible title rendered below the table.',
      },
    },
  },
  render: () => (
    <Table>
      <TableCaption>A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV-001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>INV-002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
