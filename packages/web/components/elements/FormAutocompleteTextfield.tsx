import React from "react"
import { AutocompleteProps, Autocomplete, TextFieldProps, TextField } from "@material-ui/core"
import { Control, Controller, ControllerProps } from "react-hook-form";

export type FormAutocompleteTextfieldProps<
T,
Multiple extends boolean | undefined = undefined,
DisableClearable extends boolean | undefined = undefined,
FreeSolo extends boolean | undefined = undefined,
> = Partial<TextFieldProps> & Partial<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>> & {
  name: string;
  control: Control<any>;
  defaultValue?: string;
  controllerProps?: Partial<Omit<ControllerProps, 'name' | 'control'>>;
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
  ...props
}: FormAutocompleteTextfieldProps<T, Multiple, DisableClearable, FreeSolo>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? ''}
      render={({ field: { ref, value, ...rest }, fieldState: { error } }) => (
        <Autocomplete
          value={value}
          options={[]}
          {...rest}
          {...props}
          renderInput={
            params =>
              <TextField
                margin='normal'
                variant='outlined'
                error={!!error}
                value={value}
                inputRef={ref}
                {...params} {...props}
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