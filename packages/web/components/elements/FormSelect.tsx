import React from "react"
import { FormControl, FormHelperText, InputLabel, Select, SelectProps } from "@mui/material"
import { Control, Controller, ControllerProps } from "react-hook-form"

export type FormSelectProps = SelectProps & {
  name: string;
  control: Control<any>;
  defaultValue?: string;
  helperText?: string;
  controllerProps?: Partial<Omit<ControllerProps, 'name' | 'control'>>;
}

function FormSelect({
  name,
  control,
  defaultValue,
  controllerProps,
  label,
  helperText,
  ...selectProps
}: FormSelectProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? ''}
      render={({ field: { ref, value, ...rest }, fieldState: { error } }) => (
        <FormControl error={!!error}>
          <InputLabel>{label}</InputLabel>
          <Select
            label={label}
            variant='outlined'
            value={value}
            inputRef={ref}
            {...rest}
            {...selectProps}
          />
          <FormHelperText>{error ? error.message : helperText}</FormHelperText>
        </FormControl>
      )}
      {...controllerProps}
    />
  )
}

export default FormSelect;