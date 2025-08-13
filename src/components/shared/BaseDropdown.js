import { jsx as _jsx } from "react/jsx-runtime";
import { FormControl, Select, MenuItem } from '@mui/material';
const BaseDropdown = ({ label, options, value, onChange, backgroundColor, ...selectProps }) => {
    return (_jsx(FormControl, { sx: {
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
        }, children: _jsx(Select, { sx: {
                minWidth: "180px",
                "& .MuiSelect-icon": {
                    display: "block",
                    color: "white",
                },
            }, onChange: (event) => onChange(event), label: "", value: value, ...selectProps, children: options.map((option) => (_jsx(MenuItem, { value: option.value, children: option.label }, option.value))) }) }));
};
export default BaseDropdown;
