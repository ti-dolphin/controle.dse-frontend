import React from 'react';
import { Box, useTheme } from '@mui/material';


interface BaseToolBarProps {
    children: React.ReactNode;
    transparent: boolean
}

const BaseToolBar: React.FC<BaseToolBarProps> = ({ children, transparent }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                backgroundColor: transparent ? 'transparent' : theme.palette.primary.main,
                padding: 1.5,
                gap: 2,
                width: '100%',
            }}
        >
            {children}
        </Box>
    );
};

export default BaseToolBar;
