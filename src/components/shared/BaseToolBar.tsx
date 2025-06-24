import React from 'react';
import { Box, useTheme } from '@mui/material';


interface BaseToolBarProps {
    children: React.ReactNode;
}

const BaseToolBar: React.FC<BaseToolBarProps> = ({ children }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                backgroundColor: theme.palette.primary.main,
                padding: 1.5,
                width: '100%',
            }}
        >
            {children}
        </Box>
    );
};

export default BaseToolBar;
