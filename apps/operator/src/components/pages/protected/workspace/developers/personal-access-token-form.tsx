'use client'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, infer as zInfer } from 'zod'
import { Panel, PanelHeader } from '@repo/ui/panel'
import { useToast } from '@repo/ui/use-toast'
import { Input } from '@repo/ui/input'
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
  FormLabel,
} from '@repo/ui/form'
import { Button } from '@repo/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@repo/ui/select'
import { personalAccessTokenFormStyles } from './personal-access-token-form-styles'
import {
  CreatePersonalAccessTokenInput,
  useCreatePersonalAccessTokenMutation,
} from '@repo/codegen/src/schema'
import { useGqlError } from '@/hooks/useGqlError'
import { useSession } from 'next-auth/react'
import { Info } from '@repo/ui/info'
import { addDays, formatISO, format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui/dialog'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { Copy } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(3, { message: 'Token name is required' }),
  description: z.string().optional(),
  expiration: z.string().min(1, { message: 'Expiration is required' }),
})

type FormData = zInfer<typeof formSchema>

const calculateExpiryDate = (expiration: string) => {
  const days = parseInt(expiration.split(' ')[0])
  return format(addDays(new Date(), days), 'MMMM d, yyyy')
}

const PersonalAccessTokenForm = () => {
  const { grid, copyIcon, tokenField } = personalAccessTokenFormStyles()
  const { toast } = useToast()
  const { data: sessionData } = useSession()
  const [copiedText, copyToClipboard] = useCopyToClipboard()

  const [result, createToken] = useCreatePersonalAccessTokenMutation()
  const { error } = result
  const { errorMessages } = useGqlError(error)

  const [generatedToken, setGeneratedToken] = useState<string | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      expiration: '90 days',
    },
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form

  const expirationValue = watch('expiration')
  const expiryDate = calculateExpiryDate(expirationValue)

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const expiresAt = formatISO(
      addDays(new Date(), parseInt(data.expiration.split(' ')[0])),
    )

    const personalAccessTokenInput: CreatePersonalAccessTokenInput = {
      name: data.name,
      description: data.description,
      expiresAt,
      ownerID: sessionData?.user.userId,
    }

    const response = await createToken({
      input: personalAccessTokenInput,
    })

    const createdToken =
      response.data?.createPersonalAccessToken.personalAccessToken.token

    if (response.data) {
      setGeneratedToken(createdToken || '')
      toast({
        title: `Token created successfully`,
        variant: 'success',
      })
    }
  }

  useEffect(() => {
    if (copiedText) {
      toast({
        title: 'Token copied to clipboard',
        variant: 'success',
      })
    }
  }, [copiedText])

  useEffect(() => {
    if (errorMessages.length > 0) {
      toast({
        title: errorMessages.join('\n'),
        variant: 'destructive',
      })
    }
  }, [errorMessages])

  return (
    <>
      <Panel>
        <PanelHeader heading="Create a personal access token" noBorder />
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={grid()}>
              <FormField
                name="name"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <Info>
                      A unique name for this token. May be visible to token
                      owners.
                    </Info>
                    {errors.name && (
                      <FormMessage>{errors.name.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <Info>What is this token for?</Info>
                  </FormItem>
                )}
              />

              <FormField
                name="expiration"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select expiration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30 days">30 days</SelectItem>
                          <SelectItem value="60 days">60 days</SelectItem>
                          <SelectItem value="90 days">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <Info>Which means it will expire on {expiryDate}</Info>
                    {errors.expiration && (
                      <FormMessage>{errors.expiration.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Create token</Button>
          </form>
        </Form>
      </Panel>

      <Dialog
        open={!!generatedToken}
        onOpenChange={() => setGeneratedToken(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Token Created</DialogTitle>
            <DialogDescription>
              Copy your access token now, as you will not be able to see this
              again.
            </DialogDescription>
            <div className={tokenField()}>
              <Input
                value={generatedToken || ''}
                readOnly
                icon={<Copy width={16} height={16} className={copyIcon()} />}
                onIconClick={() => {
                  copyToClipboard(generatedToken || '')
                }}
              />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { PersonalAccessTokenForm }
