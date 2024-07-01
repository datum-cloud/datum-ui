'use client'

import {
  GetOrganizationMembersQueryVariables,
  useGetOrganizationMembersQuery,
} from '@repo/codegen/src/schema'
import { useSession } from 'next-auth/react'

export const MembersTable = () => {
  const { data: session } = useSession()

  const variables: GetOrganizationMembersQueryVariables = {
    organizationId: session?.user.organization ?? '',
  }
  const [{ data, fetching, error }] = useGetOrganizationMembersQuery({
    variables,
    pause: !session,
  })

  console.log(data)
  return <div>members-table</div>
}
