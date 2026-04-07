export interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
}

export const sampleUsers: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'active', createdAt: '2024-02-20' },
  { id: '3', name: 'Carol Williams', email: 'carol@example.com', role: 'Viewer', status: 'inactive', createdAt: '2024-03-10' },
  { id: '4', name: 'Dave Brown', email: 'dave@example.com', role: 'Editor', status: 'active', createdAt: '2024-04-05' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'active', createdAt: '2024-05-12' },
  { id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', status: 'inactive', createdAt: '2024-06-18' },
  { id: '7', name: 'Grace Wilson', email: 'grace@example.com', role: 'Editor', status: 'active', createdAt: '2024-07-22' },
  { id: '8', name: 'Hank Moore', email: 'hank@example.com', role: 'Viewer', status: 'active', createdAt: '2024-08-30' },
  { id: '9', name: 'Ivy Taylor', email: 'ivy@example.com', role: 'Admin', status: 'inactive', createdAt: '2024-09-14' },
  { id: '10', name: 'Jack Anderson', email: 'jack@example.com', role: 'Editor', status: 'active', createdAt: '2024-10-01' },
  { id: '11', name: 'Kate Thomas', email: 'kate@example.com', role: 'Viewer', status: 'active', createdAt: '2024-10-15' },
  { id: '12', name: 'Leo Jackson', email: 'leo@example.com', role: 'Admin', status: 'active', createdAt: '2024-11-01' },
]

export const roleOptions = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Editor', value: 'Editor' },
  { label: 'Viewer', value: 'Viewer' },
]

export const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

export interface Post {
  userId: number
  id: number
  title: string
  body: string
}
