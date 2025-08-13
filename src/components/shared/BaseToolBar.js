import { jsx as _jsx } from "react/jsx-runtime";
import { Box, useTheme } from '@mui/material';
const BaseToolBar = ({ children, transparent }) => {
    const theme = useTheme();
    return (_jsx(Box, { sx: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: transparent ? 'transparent' : theme.palette.primary.main,
            padding: 0.8,
            gap: 2,
            width: '100%',
        }, children: children }));
};
export default BaseToolBar;
