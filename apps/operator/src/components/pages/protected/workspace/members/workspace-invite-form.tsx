'use client'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler, Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, infer as zInfer } from 'zod'
import { TagInput } from '@repo/ui/tag-input'
import { Panel, PanelHeader } from '@repo/ui/panel'
import { useToast } from '@repo/ui/use-toast'
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from '@repo/ui/form'
import { Button } from '@repo/ui/button'
import { Tag } from 'emblor'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@repo/ui/select'
import { workspaceInviteStyles } from './workspace-invite-form.styles'

import {
  CreateInviteInput,
  InputMaybe,
  InviteRole,
  useCreateBulkInviteMutation,
} from '@repo/codegen/src/schema'
import { useGqlError } from '@/hooks/useGqlError'

const formSchema = z.object({
  emails: z.array(z.string().email({ message: 'Invalid email address' })),
  role: z
    .nativeEnum(InviteRole, {
      errorMap: () => ({ message: 'Invalid role' }),
    })
    .default(InviteRole.MEMBER),
})

type FormData = zInfer<typeof formSchema>

const WorkspaceInviteForm = ({ inviteAdmins }: { inviteAdmins: boolean }) => {
  const { buttonRow, roleRow } = workspaceInviteStyles()
  const { toast } = useToast()

  const [result, inviteMembers] = useCreateBulkInviteMutation()
  const { error, fetching } = result
  const { errorMessages } = useGqlError(error)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: InviteRole.MEMBER,
    },
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form

  const [emails, setEmails] = useState<Tag[]>([])
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)
  const [currentValue, setCurrentValue] = useState('')


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const inviteInput: InputMaybe<
      Array<CreateInviteInput> | CreateInviteInput
    > = data.emails.map((email) => ({
      recipient: email,
      role: data.role,
    }))

    const response = await inviteMembers({
      input: inviteInput,
    })

    response.data &&
      toast({
        title: `Invite${emails.length > 1 ? 's' : ''} sent successfully`,
        variant: 'success',
      })
    setEmails([])
  }

  const errorMessage =
    errors.emails && Array.isArray(errors.emails) && errors.emails.length > 0
      ? errors.emails[0]?.message
      : null

  useEffect(() => {
    if (errorMessages.length > 0) {
      toast({
        title: errorMessages.join('\n'),
        variant: 'destructive',
      })
    }
  }, [errorMessages])

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleBlur = () => {
    if (isValidEmail(currentValue)) {
      const newTag = { id: currentValue, text: currentValue }
      setEmails((prev) => [...prev, newTag])
      setValue('emails', [...emails.map((tag) => tag.text), currentValue])
      setCurrentValue('')
    }
  }

  return (
    <Panel>
      <PanelHeader
        heading="Invite new members"
        subheading="Enter or paste one or more email addresses, separated by commas."
        noBorder
      />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            name="emails"
            control={control as unknown as Control<FormData>}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TagInput
                    {...field}
                    tags={emails}
                    setTags={(newTags: Tag[]) => {
                      const emailTags = newTags.map((tag) => tag.text)
                      setEmails(newTags)
                      setValue('emails', emailTags)
                    }}
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                    inputProps={{ value: currentValue }}
                    onInputChange={(newValue: string) =>
                      setCurrentValue(newValue)
                    }
                    onBlur={handleBlur}
                  />
                </FormControl>
                {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
              </FormItem>
            )}
          />

          <div className={buttonRow()}>
            <div className={roleRow()}>
              Role:{' '}
              <FormField
                name="role"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(InviteRole)
                            .reverse()
                            .filter(([key]) => !key.includes('USER'))
                            .filter(([key]) => {
                              if (!inviteAdmins) {
                                return !key.includes('ADMIN');
                              }

                              return true;
                            })
                            .map(([key, value], i) => (
                              <SelectItem key={i} value={value}>
                                {key[0].toUpperCase() +
                                  key.slice(1).toLowerCase()}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {errors.role && (
                      <FormMessage>{errors.role.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={emails.length === 0}>
              Send invitation{emails.length > 1 && 's'}
            </Button>
          </div>
        </form>
      </Form>
    </Panel>
  )
}

export { WorkspaceInviteForm }
