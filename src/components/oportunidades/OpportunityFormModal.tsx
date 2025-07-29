
import React from "react";
import { Modal, Box, Typography, IconButton, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Opportunity } from "../../models/oportunidades/Opportunity";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setCreating, setViewing } from "../../redux/slices/oportunidades/opportunitySlice";
import { create } from "lodash";
import { useNavigate } from "react-router-dom";
import OpportunityForm from "./OpportunityForm";

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  p: 4,
  borderRadius: 2,
  minWidth: { 
    xs: 300,
    sm: 600
  },
};

const OpportunityFormModal: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {creating, viewing, editing} = useSelector((state: RootState) => state.opportunity);


  const close = () => {
    dispatch(setCreating(false));
    dispatch(setViewing(false));
  };


  const handleClose = () => {
     close();
  };

  return (
    <Modal open={creating || viewing} onClose={handleClose}>
      <Box sx={style}>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon color="error" />
        </IconButton>
        <Typography
          variant="h6"
          fontWeight={600}
          textTransform="uppercase"
          color={"primary.main"}
        >
          Nova Proposta
        </Typography>
        <Box sx={{mt: 4, width: '100%'}}>
          <OpportunityForm />
        </Box>
      </Box>
    </Modal>
  );
};

export default OpportunityFormModal;
