'use client'
import { useDeleteOrganizationMutation } from '@repo/codegen/src/schema'
import { Panel, PanelHeader } from '@repo/ui/panel'
import { useSession } from 'next-auth/react'

import { Button } from '@repo/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@repo/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { useToast } from '@repo/ui/use-toast'
import { userHasWorkspaceDeletePermissions } from '@/lib/authz/utils'

const WorkspaceDelete = async () => {
  const { toast } = useToast()
  const { push } = useRouter()

  const [{ fetching: isSubmitting }, deleteOrganization] =
    useDeleteOrganizationMutation()
  const { data: sessionData, update } = useSession()
  const currentOrgId = sessionData?.user.organization

  const canDelete = await userHasWorkspaceDeletePermissions(sessionData)

  if (!canDelete) {
    return null
  }

  const clickHandler = async () => {
    const response = await deleteOrganization({
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
    toast({
      title: 'Workspace successfully deleted',
      variant: 'success',
    })
    push('/workspace')
  }

  return (
    <>
      <Panel>
        <PanelHeader heading="Delete workspace" noBorder />
        <Panel align="start" destructive>
          <p className="red">Deleting your workspace is irreversible.</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="redOutline" type="button" loading={isSubmitting}>
                Delete this workspace
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your workspace and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline">Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button variant="sunglow" onClick={clickHandler}>
                    Delete workspace
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Panel>
      </Panel>{' '}
    </>
  )
}

export { WorkspaceDelete }
