import React from 'react';
import { Toolbar, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface UpperNavigationProps {
  handleBack: () => void;
  children?: React.ReactNode;
}

const UpperNavigation: React.FC<UpperNavigationProps> = ({ handleBack, children }) => {
  return (
    <Box
      sx={{
        maxHeight: { 
          md: 40,
          xs: 100
        },
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "white",
        mb: 0.5,
        borderRadius: 1,
        gap: 2
      }}
      position="static"
    >
      <Toolbar>
        <IconButton
          edge="start"
          sx={{
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            color: "white",
            height: 30,
            width: 30,
          }}
          aria-label="back"
          onClick={handleBack}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }}/>
        </IconButton>
      </Toolbar>
        {children}
    </Box>
  );
};

export default UpperNavigation;

