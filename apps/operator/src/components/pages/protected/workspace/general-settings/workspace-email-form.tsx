'use client'
import {
  useGetAllOrganizationsQuery,
  useUpdateOrganizationMutation,
} from '@repo/codegen/src/schema'
import { Input, InputRow } from '@repo/ui/input'
import { Panel, PanelHeader } from '@repo/ui/panel'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from '@repo/ui/form'
import { z } from 'zod'
import { Button } from '@repo/ui/button'
import { useEffect, useState } from 'react'
import { RESET_SUCCESS_STATE_MS } from '@/constants'

const WorkspaceEmailForm = () => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [{ fetching: isSubmitting }, updateOrganisation] =
    useUpdateOrganizationMutation()
  const { data: sessionData } = useSession()
  const currentOrgId = sessionData?.user.organization
  const [allOrgs] = useGetAllOrganizationsQuery()
  const currentWorkspace = allOrgs.data?.organizations.edges?.filter(
    (org) => org?.node?.id === currentOrgId,
  )[0]?.node

  const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  useEffect(() => {
    if (currentWorkspace) {
      form.reset({
        email: currentWorkspace.setting?.billingEmail ?? undefined,
      })
    }
  }, [currentWorkspace, form])

  const updateWorkspace = async ({ email }: { email: string }) => {
    await updateOrganisation({
      updateOrganizationId: currentOrgId,
      input: {
        updateOrgSettings: {
          billingEmail: email,
        },
      },
    })
    setIsSuccess(true)
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateWorkspace({ email: data.email })
  }

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false)
      }, RESET_SUCCESS_STATE_MS)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  return (
    <Panel>
      <PanelHeader heading="Billing email" noBorder />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <InputRow>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant={isSuccess ? 'success' : 'sunglow'}
              type="submit"
              loading={isSubmitting}
            >
              {isSubmitting ? 'Saving' : isSuccess ? 'Saved' : 'Save'}
            </Button>
          </InputRow>
        </form>
      </Form>
    </Panel>
  )
}

export { WorkspaceEmailForm }
