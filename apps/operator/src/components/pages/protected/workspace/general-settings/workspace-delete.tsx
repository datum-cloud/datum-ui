'use client'
import { useDeleteOrganizationMutation } from '@repo/codegen/src/schema'
import { Panel, PanelHeader } from '@repo/ui/panel'
import { useSession } from 'next-auth/react'

import { Button } from '@repo/ui/button'
import { useEffect, useState } from 'react'
import { RESET_SUCCESS_STATE_MS } from '@/constants'
import { useRouter } from 'next/navigation'

const WorkspaceDelete = () => {
  const [isSuccess, setIsSuccess] = useState(false)
  const { push } = useRouter()
  const [{ fetching: isSubmitting }, deleteOrganisation] =
    useDeleteOrganizationMutation()
  const { data: sessionData, update } = useSession()
  const currentOrgId = sessionData?.user.organization

  const clickHandler = async () => {
    const response = await deleteOrganisation({
      deleteOrganizationId: currentOrgId,
    })

    if (response.extensions && sessionData) {
      await update({
        ...sessionData,
        user: {
          ...sessionData.user,
          accessToken: response.extensions.auth.access_token,
          organization: response.extensions.auth.authorized_organization,
          refreshToken: response.extensions.auth.refresh_token,
        },
      })
    }
    setIsSuccess(true)
    response.data && push('/workspace')
  }

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false)
        push('/workspace')
      }, RESET_SUCCESS_STATE_MS)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  return (
    <Panel>
      <PanelHeader heading="Delete workspace" noBorder />
      <Button
        variant={isSuccess ? 'success' : 'redOutline'}
        type="button"
        onClick={clickHandler}
        loading={isSubmitting}
      >
        {isSubmitting
          ? 'Deleting'
          : isSuccess
            ? 'Workspace deleted'
            : 'Delete this workspace'}
      </Button>
    </Panel>
  )
}

export { WorkspaceDelete }
