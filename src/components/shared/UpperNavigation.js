import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Toolbar, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const UpperNavigation = ({ handleBack, children }) => {
    return (_jsxs(Box, { sx: {
            maxHeight: 40,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "white",
            mb: 0.5,
            borderRadius: 1,
            gap: 2
        }, position: "static", children: [_jsx(Toolbar, { children: _jsx(IconButton, { edge: "start", sx: {
                        backgroundColor: "primary.main",
                        "&:hover": {
                            backgroundColor: "primary.dark",
                        },
                        color: "white",
                        height: 30,
                        width: 30,
                    }, "aria-label": "back", onClick: handleBack, children: _jsx(ArrowBackIcon, { sx: { fontSize: 20 } }) }) }), children] }));
};
export default UpperNavigation;
