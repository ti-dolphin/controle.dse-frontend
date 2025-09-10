
import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setCreating, setViewing } from "../../redux/slices/oportunidades/opportunitySlice";
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
  const {creating, viewing} = useSelector((state: RootState) => state.opportunity);


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
          color={"primary.main"}
        >
          Nova Proposta
        </Typography>
        <Box sx={{ width: '100%'}}>
          <OpportunityForm />
        </Box>
      </Box>
    </Modal>
  );
};

export default OpportunityFormModal;
