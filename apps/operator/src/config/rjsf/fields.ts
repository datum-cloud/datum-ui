import { Input } from '@repo/ui/input'
import { FormProps } from '@rjsf/core'
import { RegistryFieldsType } from '@rjsf/utils'

const MyCustomWidget = (props) => {
  return (
    <Input type="text"
      className="custom"
      value={props.value}
      required={props.required}
      onChange={(event) => props.onChange(event.target.value)} />
  );
};

export const rjsfFields: RegistryFieldsType = {
  StringField: MyCustomWidget,
}
