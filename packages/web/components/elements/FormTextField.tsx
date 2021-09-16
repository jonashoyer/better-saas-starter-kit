import React from "react"
import { TextFieldProps } from "@mui/material"
import { TextField } from "@mui/material"
import { Control, Controller, ControllerProps } from "react-hook-form"

export type FormTextFieldProps = TextFieldProps & {
  name: string;
  control: Control<any>;
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
          value={value}
          inputRef={ref}
          {...rest}
          {...textFieldProps}
          helperText={error ? error.message : null}
        />
      )}
      {...controllerProps}
    />
  )
}

export default FormTextField;