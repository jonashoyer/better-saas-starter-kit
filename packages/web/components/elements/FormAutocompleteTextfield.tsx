import React from "react"
import { AutocompleteProps, Autocomplete, TextFieldProps, TextField } from "@mui/material"
import { Control, Controller, ControllerProps } from "react-hook-form";


export type FormAutocompleteTextfieldProps<
T,
Multiple extends boolean | undefined = undefined,
DisableClearable extends boolean | undefined = undefined,
FreeSolo extends boolean | undefined = undefined,
> = Partial<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>> & {
  name: string;
  control: Control<any>;
  defaultValue?: string;
  controllerProps?: Partial<Omit<ControllerProps, 'name' | 'control'>>;
  textFieldProps?: Partial<TextFieldProps>;
}

function FormAutocompleteTextfield<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>({
  name,
  control,
  defaultValue,
  controllerProps,
  textFieldProps,
  ...props
}: FormAutocompleteTextfieldProps<T, Multiple, DisableClearable, FreeSolo>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? null}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          onChange={(_, data) => field.onChange(data)}
          options={[]}
          {...props}
          renderInput={
            params =>
              <TextField
                margin='normal'
                variant='outlined'
                error={!!error}
                {...textFieldProps}
                {...params}
                helperText={error ? error.message : null}
              />
          }
        />
      )}
      {...controllerProps}
    />
  )
}

export default FormAutocompleteTextfield;