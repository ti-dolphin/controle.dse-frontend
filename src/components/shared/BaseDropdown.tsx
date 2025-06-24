import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectProps, SelectChangeEvent } from '@mui/material';

export interface BaseDropdownOption {
    label: string;
    value: string | number;
}

export interface BaseDropdownProps extends Omit<SelectProps, "onChange"> {
  label: string;
  options: BaseDropdownOption[];
  value: string | number;
  onChange: (event: SelectChangeEvent<unknown>) => void;
  backgroundColor: string;
}

const BaseDropdown: React.FC<BaseDropdownProps> = ({
    label,
    options,
    value,
    onChange,
    backgroundColor,
    ...selectProps
}) => {

    return (
      <FormControl
        sx={{
          "& .MuiInputBase-root": {
            width: "fit-content",
            display: "flex",
            justifyContent: "center",
            borderRadius: "100px",
            fontSize: 'small',
            "&:hover fieldset": {
              borderColor: backgroundColor, // Remove border on hover
            },
          },
          "& .MuiSelect-select.MuiSelect-select": {
            paddingRight: "0px",
            borderRadius: "100px",
            padding: 1.2,
            backgroundColor: backgroundColor,
            color: "white",
          },
        }}
      >
        <Select
          sx={{
            minWidth: "180px",
            "& .MuiSelect-icon": {
              display: "block",
              color: "white",
              
            },
          }}
          onChange={(event) => onChange(event)}
          label={""}
          value={value}
          {...selectProps}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
};

export default BaseDropdown;