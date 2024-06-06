'use client'

import { createWorkspaceStyles } from './create-workspace.styles'
import { Panel, PanelHeader } from '@repo/ui/panel'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@repo/ui/form'
import { Info } from '@repo/ui/info'
import { Input } from '@repo/ui/input'
import { Button } from '@repo/ui/button'
import { z } from 'zod'
import { useCreateOrganizationMutation } from '@repo/codegen/src/schema'

const formSchema = z.object({
  name: z.string().max(32, {
    message: 'Please use 32 characters at maximum.',
  }),
  displayName: z.string().min(2, {
    message: 'Display name must be at least 2 characters',
  }),
})

export const CreateWorkspaceForm = () => {
  const [result, addOrganization] = useCreateOrganizationMutation()
  const { data, error, fetching } = result
  console.log(data)

  const isLoading = fetching
  const { container } = createWorkspaceStyles()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      displayName: '',
    },
  })

  const createWorkspace = async ({
    name,
    displayName,
  }: {
    name: string
    displayName?: string
  }) => {
    addOrganization({
      input: {
        name: name,
        displayName: displayName,
      },
    }).then((result) => {
      return result
    })
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createWorkspace({ name: data.name, displayName: data.displayName })
  }

  return (
    <div className={container()}>
      <Panel>
        <PanelHeader
          heading="Create your first workspace"
          subheading="To get started create a workspace for your business or department."
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <Info>Please use 32 characters at maximum.</Info>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isLoading ? 'Creating workspace' : 'Create workspace'}
            </Button>
          </form>
        </Form>
      </Panel>
    </div>
  )
}
