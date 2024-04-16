'use client'

import { useState } from 'react'
import { workspaceSelectorStyles } from './workspace-selector.styles'
import { useGetAllOrganizationsQuery } from '@repo/codegen/src/schema'
import { Logo } from '@repo/ui/logo'
import { ArrowRight, ChevronDown, SearchIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/popover'
import { Avatar, AvatarFallback } from '@repo/ui/avatar'
import { Input } from '@repo/ui/input'
import { Tag } from '@repo/ui/tag'
import Link from 'next/link'

export const WorkspaceSelector = () => {
  const [workspaceSearch, setWorkspaceSearch] = useState('')
  const [allOrgs] = useGetAllOrganizationsQuery()

  const {
    container,
    logoWrapper,
    workspaceLabel,
    workspaceDropdown,
    allWorkspacesLink,
    popoverContent,
    searchWrapper,
    orgWrapper,
    orgInfo,
    orgTitle,
  } = workspaceSelectorStyles()

  if (!allOrgs.data || allOrgs.fetching || allOrgs.error) {
    return (
      <Link href={'/'} className={logoWrapper()}>
        <Logo width={115} theme="dark" />
      </Link>
    )
  }

  const orgs = allOrgs.data.organizations.edges || []
  const filteredOrgs = orgs.filter((org) => {
    return org?.node?.name.toLowerCase().includes(workspaceSearch.toLowerCase())
  })

  if (orgs.length === 1) {
    return (
      <Link href={'/'} className={logoWrapper()}>
        <Logo width={115} theme="dark" />
      </Link>
    )
  }

  return (
    <div className={container()}>
      <Logo width={30} asIcon theme="blackberryLight" />
      <div>
        <div className={workspaceLabel()}>Workspace:</div>
        <Popover>
          <PopoverTrigger>
            <div className={workspaceDropdown()}>
              <span>{orgs && orgs[0]?.node?.displayName}</span>
              <ChevronDown width={18} strokeWidth={2} />
            </div>
          </PopoverTrigger>
          <PopoverContent align="start" className={popoverContent()}>
            <div className={searchWrapper()}>
              <Input
                value={workspaceSearch}
                name="workspace"
                placeholder="Search for a workspace"
                onChange={(e) => {
                  setWorkspaceSearch(e.currentTarget.value)
                }}
                icon={<SearchIcon width={17} />}
              />
            </div>
            {filteredOrgs.map((org) => {
              return (
                <div key={org?.node?.id} className={orgWrapper()}>
                  <div>
                    <Avatar>
                      <AvatarFallback>
                        {org?.node?.displayName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className={orgInfo()}>
                    <div className={orgTitle()}>{org?.node?.displayName}</div>
                    <Tag>Owner</Tag>
                  </div>
                </div>
              )
            })}
            <div>
              <Link href="#" className={allWorkspacesLink()}>
                View all workspaces
                <ArrowRight width={10} />
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
