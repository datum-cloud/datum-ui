import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { defineStepper } from '@datum-cloud/datum-ui/stepper'

const { Stepper, steps } = defineStepper(
  { id: 'step-1', title: 'Account', description: 'Create your account' },
  { id: 'step-2', title: 'Profile', description: 'Set up your profile' },
  { id: 'step-3', title: 'Complete', description: 'Review and finish' },
)

function StepperDemo({ initialStep }: { initialStep?: string }) {
  return (
    // eslint-disable-next-line react/no-context-provider -- Stepperize's Stepper is not a React Context; .Provider is required
    <Stepper.Provider variant="horizontal" initialStep={initialStep as any}>
      {({ methods }: any) => (
        <div className="flex flex-col gap-6">
          <Stepper.Navigation>
            {steps.map(step => (
              <Stepper.Step key={step.id} of={step.id} onClick={() => methods.navigation.goTo(step.id)}>
                <Stepper.Title>{step.title}</Stepper.Title>
                <Stepper.Description>{step.description}</Stepper.Description>
              </Stepper.Step>
            ))}
          </Stepper.Navigation>

          <div className="rounded-lg border p-6">
            {steps.map(step => (
              <div key={step.id}>
                {methods.state.current.data.id === step.id && (
                  <div>
                    <h3 className="text-lg font-medium">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Stepper.Controls>
            <button
              type="button"
              className="rounded-md border px-4 py-2 text-sm"
              onClick={() => methods.navigation.prev()}
              disabled={methods.state.isFirst}
            >
              Previous
            </button>
            <button
              type="button"
              className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm"
              onClick={() => methods.state.isLast ? console.log('Done!') : methods.navigation.next()}
            >
              {methods.state.isLast ? 'Complete' : 'Next'}
            </button>
          </Stepper.Controls>
        </div>
      )}
    </Stepper.Provider>
  )
}

const meta: Meta = {
  title: 'Features/Stepper',
  component: StepperDemo,
  argTypes: {
    initialStep: {
      control: { type: 'select' },
      options: ['step-1', 'step-2', 'step-3'],
    },
  },
  args: {
    initialStep: 'step-1',
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: (args: Record<string, unknown>) => <StepperDemo initialStep={args.initialStep as string} />,
}

export const WithActiveStep: Story = {
  render: () => <StepperDemo initialStep="step-2" />,
}
