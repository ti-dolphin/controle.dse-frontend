import { jsx as _jsx } from "react/jsx-runtime";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
export const BaseAddButton = (props) => {
    const { handleOpen, text } = props;
    return (_jsx(IconButton, { sx: {
            bgcolor: "secondary.main",
            color: "white",
            borderRadius: "50%",
            width: 32,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
                bgcolor: "secondary.main",
                scale: "1.1",
                transition: "all 0.2s ease-in-out",
            },
        }, onClick: handleOpen, "aria-label": text ? text : "Adicionar", children: _jsx(AddIcon, { sx: { width: 24, height: 24 } }) }));
};
