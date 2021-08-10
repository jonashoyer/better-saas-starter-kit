import React from "react"
import { TextFieldProps } from "@material-ui/core"
import { TextField } from "@material-ui/core"
import { Control, Controller, ControllerProps } from "react-hook-form"

export type FormTextFieldProps = TextFieldProps & {
  name: string;
  control: Control;
  defaultValue?: string;
  controllerProps?: Partial<Omit<ControllerProps, 'name' | 'control'>>;
}

function FormTextField({
  name,
  control,
  defaultValue,
  controllerProps,
  ...textFieldProps
}: FormTextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? ''}
      render={({ field: { ref, value, ...rest }, fieldState: { error } }) => (
        <TextField
          margin='normal'
          variant='outlined'
          error={!!error}
          helperText={error ? error.message : null}
          value={value}
          inputRef={ref}
          {...rest}
          {...textFieldProps}
        />
      )}
      {...controllerProps}
    />
  )
}

export default FormTextField;