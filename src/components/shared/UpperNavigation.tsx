import React from 'react';
import { AppBar, Toolbar, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface UpperNavigationProps {
  handleBack: () => void;
}

const UpperNavigation: React.FC<UpperNavigationProps> = ({ handleBack }) => {
  return (
    <Box
      sx={{
        maxHeight: 40,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "white",
        mb: 0.5,
        borderRadius: 1
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
    </Box>
  );
};

export default UpperNavigation;

