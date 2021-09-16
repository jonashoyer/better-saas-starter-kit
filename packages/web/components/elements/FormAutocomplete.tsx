import React from "react"
import { AutocompleteProps, Autocomplete, TextField } from "@mui/material"
import { Control, Controller, ControllerProps } from "react-hook-form";

export type FormAutocompleteProps<
T,
Multiple extends boolean | undefined = undefined,
DisableClearable extends boolean | undefined = undefined,
FreeSolo extends boolean | undefined = undefined,
> = Partial<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>> & {
  name: string;
  control: Control<any>;
  defaultValue?: string;
  controllerProps?: Partial<Omit<ControllerProps, 'name' | 'control'>>;
}

function FormAutocomplete<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>({
  name,
  control,
  defaultValue,
  controllerProps,
  ...autocompleteProps
}: FormAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? ''}
      render={({ field: { ref, value, ...rest }, fieldState: { error } }) => (
        <Autocomplete
          ref={ref}
          value={value}
          options={[]}
          {...rest}
          {...autocompleteProps}
          renderInput={(params) => <TextField variant='outlined' {...params} />}
        />
      )}
      {...controllerProps}
    />
  )
}

export default FormAutocomplete;