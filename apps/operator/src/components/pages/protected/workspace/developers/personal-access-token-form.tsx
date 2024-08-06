'use client'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
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
import { personalAccessTokenFormStyles } from './personal-access-token-form-styles'
import {
  CreatePersonalAccessTokenInput,
  useCreatePersonalAccessTokenMutation,
} from '@repo/codegen/src/schema'
import { useGqlError } from '@/hooks/useGqlError'
import { useSession } from 'next-auth/react'
import { Info } from '@repo/ui/info'
import { Checkbox } from '@repo/ui/checkbox'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui/dialog'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { Copy } from 'lucide-react'
import { CalendarIcon } from '@radix-ui/react-icons'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/popover'
import { Calendar } from '@repo/ui/calendar'

const formSchema = z
  .object({
    name: z.string().min(3, { message: 'Token name is required' }),
    description: z.string().optional(),
    expiryDate: z.date().optional(),
    noExpire: z.boolean().optional(),
  })
  .refine((data) => data.expiryDate || data.noExpire, {
    message:
      'Please specify an expiry date or select the Never expires checkbox',
    path: ['expiryDate'],
  })

type FormData = zInfer<typeof formSchema>

const PersonalAccessTokenForm = () => {
  const {
    grid,
    copyIcon,
    tokenField,
    calendarIcon,
    calendarInput,
    expiryColumn,
    calendarPopover,
    checkboxRow,
  } = personalAccessTokenFormStyles()
  const { toast } = useToast()
  const { data: sessionData } = useSession()
  const [copiedText, copyToClipboard] = useCopyToClipboard()

  const [result, createToken] = useCreatePersonalAccessTokenMutation()
  const { error } = result
  const { errorMessages } = useGqlError(error)

  const [generatedToken, setGeneratedToken] = useState<string | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      expiryDate: undefined,
      noExpire: false,
    },
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const personalAccessTokenInput: CreatePersonalAccessTokenInput = {
      name: data.name,
      description: data.description,
      expiresAt: data.expiryDate,
      ownerID: sessionData?.user.userId,
      organizationIDs: [sessionData?.user.organization],
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

  const noExpire = watch('noExpire')

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
                control={control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem className={expiryColumn()}>
                    <FormLabel>Expiration</FormLabel>
                    {!noExpire && (
                      <Popover
                        open={isCalendarOpen}
                        onOpenChange={setIsCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outlineLight"
                              childFull
                              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            >
                              <div className={calendarInput()}>
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Select a date:</span>
                                )}
                                <CalendarIcon className={calendarIcon()} />
                              </div>
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className={calendarPopover()}
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date)
                              setIsCalendarOpen(false)
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                    <Controller
                      name="noExpire"
                      control={control}
                      render={({ field }) => (
                        <div className={checkboxRow()}>
                          <Checkbox
                            id={field.name}
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked)
                              if (checked) {
                                setValue('expiryDate', undefined)
                              }
                            }}
                          />
                          <FormLabel
                            htmlFor="no-expire"
                            className="ml-2 cursor-pointer"
                          >
                            Never expires
                          </FormLabel>
                        </div>
                      )}
                    />
                    {errors.expiryDate && (
                      <FormMessage>{errors.expiryDate.message}</FormMessage>
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
