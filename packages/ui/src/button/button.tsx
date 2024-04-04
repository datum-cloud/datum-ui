import { Slot } from '@radix-ui/react-slot'
import { forwardRef } from 'react'
import { buttonStyles, type ButtonProps } from './button.styles'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, icon, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={buttonStyles(props) + (className ? ` ${className}` : '')}
        ref={ref}
        {...props}
      >
        {props.children} {icon}
      </Comp>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonStyles }
