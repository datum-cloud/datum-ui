import type { Meta, StoryObj } from 'storybook-react-rsbuild'
import { defineStepper } from '@datum-cloud/datum-ui/stepper'

const { Stepper, steps } = defineStepper(
  { id: 'step-1', title: 'Account', description: 'Create your account' },
  { id: 'step-2', title: 'Profile', description: 'Set up your profile' },
  { id: 'step-3', title: 'Complete', description: 'Review and finish' },
)

const { Stepper: StepperV, steps: stepsV } = defineStepper(
  { id: 'v-1', title: 'General', description: 'Basic information' },
  { id: 'v-2', title: 'Configuration', description: 'Set up your service' },
  { id: 'v-3', title: 'Review', description: 'Confirm and deploy' },
)

const { Stepper: StepperC, steps: stepsC } = defineStepper(
  { id: 'c-1', title: 'Step 1', description: 'First step' },
  { id: 'c-2', title: 'Step 2', description: 'Second step' },
  { id: 'c-3', title: 'Step 3', description: 'Third step' },
)

function StepperDemo({ initialStep }: { initialStep?: string }) {
  return (
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
              onClick={() => methods.state.isLast ? alert('Done!') : methods.navigation.next()}
            >
              {methods.state.isLast ? 'Complete' : 'Next'}
            </button>
          </Stepper.Controls>
        </div>
      )}
    </Stepper.Provider>
  )
}

function VerticalStepperDemo() {
  return (
    <StepperV.Provider variant="vertical">
      {({ methods }: any) => (
        <div className="flex flex-col gap-4">
          <StepperV.Navigation>
            {stepsV.map(step => (
              <StepperV.Step key={step.id} of={step.id} onClick={() => methods.navigation.goTo(step.id)}>
                <StepperV.Title>{step.title}</StepperV.Title>
                <StepperV.Description>{step.description}</StepperV.Description>
                <div className="rounded-lg border p-4 text-sm">
                  Panel content for
                  {' '}
                  <strong>{step.title}</strong>
                </div>
              </StepperV.Step>
            ))}
          </StepperV.Navigation>
          <StepperV.Controls>
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
              onClick={() => methods.navigation.next()}
              disabled={methods.state.isLast}
            >
              Next
            </button>
          </StepperV.Controls>
        </div>
      )}
    </StepperV.Provider>
  )
}

function CircleStepperDemo() {
  return (
    <StepperC.Provider variant="circle">
      {({ methods }: any) => (
        <div className="flex flex-col gap-6">
          <StepperC.Navigation>
            {stepsC.map(step => (
              <StepperC.Step key={step.id} of={step.id}>
                <StepperC.Title>{step.title}</StepperC.Title>
                <StepperC.Description>{step.description}</StepperC.Description>
              </StepperC.Step>
            ))}
          </StepperC.Navigation>
          <StepperC.Controls>
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
              onClick={() => methods.navigation.next()}
              disabled={methods.state.isLast}
            >
              Next
            </button>
          </StepperC.Controls>
        </div>
      )}
    </StepperC.Provider>
  )
}

const meta: Meta = {
  title: 'Features/Stepper',
  component: StepperDemo,
  parameters: {
    docs: {
      description: {
        component:
          'A multi-step form navigation component with horizontal, vertical, and circle variants.\n\n'
          + 'Stepper is built on [@stepperize/react](https://stepperize.vercel.app/). '
          + 'Define steps with `defineStepper(...)` which returns a scoped `Stepper` namespace, `useStepper` hook, '
          + 'and `steps` array. Compose `Stepper.Provider`, `Stepper.Navigation`, `Stepper.Step`, `Stepper.Title`, '
          + '`Stepper.Description`, `Stepper.Panel`, and `Stepper.Controls` for full layout control. '
          + 'The `Provider` accepts `variant` (`horizontal` | `vertical` | `circle`), an optional `initialStep` ID, '
          + '`labelOrientation`, and `tracking` for auto-scroll. Navigation methods are exposed via the render-prop `methods`.\n\n'
          + '**External dependency:** `@stepperize/react`',
      },
    },
  },
  argTypes: {
    initialStep: {
      control: 'select',
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
  parameters: {
    docs: {
      description: {
        story:
          'Horizontal stepper with Previous / Next controls. '
          + 'Use the `initialStep` control to start on a specific step.',
      },
    },
  },
  render: (args: Record<string, unknown>) => <StepperDemo initialStep={args.initialStep as string} />,
}

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`variant="vertical"` stacks steps top-to-bottom. '
          + 'Panel content is nested directly inside each `Stepper.Step`.',
      },
    },
  },
  render: () => <VerticalStepperDemo />,
}

export const Circle: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`variant="circle"` shows a circular progress ring with the current step count '
          + 'instead of individual step indicators.',
      },
    },
  },
  render: () => <CircleStepperDemo />,
}
