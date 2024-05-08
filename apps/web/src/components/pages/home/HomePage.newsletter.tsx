'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, MailCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormMessage,
  Input,
} from '@/components/ui'
import { useCreateSubscriberMutation } from '@repo/codegen/src/schema'

import { newsletterStyles } from './HomePage.styles'

const formSchema = z.object({
  email: z.string().email(),
})

export const HomePageNewsletter = () => {
  const {
    wrapper,
    input,
    button,
    errorMessage,
    success,
    successMessage,
    successIcon,
  } = newsletterStyles()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  // use the mutation to add a subscriber 
  const subscribeToNewsletter = async (email: string) => {
    addSubscriber({
      input: {
        email: email,
      },
    }).then((result) => {
      return result
    })
  }

  const onSubmit = ({ email }: z.infer<typeof formSchema>) => {
    subscribeToNewsletter(email)
  }

  // get the result and error from the mutation
  const [result, addSubscriber] = useCreateSubscriberMutation()
  const { data, error } = result
  const isLoading = result.fetching

  return (
    <>
      {data ? (
        <div className={success()}>
          <MailCheck size={24} className={successIcon()} />
          <span className={successMessage()}>Thank you for subscribing. Please check your email and click on the super sweet verification link.</span>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={wrapper()}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Your email"
                      variant="outline"
                      className={input()}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />
            <Button type="submit" variant="white" className={button()}>
              {isLoading && <LoaderCircle className="animate-spin" size={20} />}
              {isLoading ? 'Loading' : 'Stay in the loop'}
            </Button>
          </form>
          {error && <div className={errorMessage()}>{error?.graphQLErrors[0].message}</div>}
        </Form>
      )}
    </>
  )
}
