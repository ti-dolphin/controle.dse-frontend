import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "../../redux/slices/requisicoes/requisitionSlice";
import { Modal, Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RequisitionForm from "./RequisitionForm";
import { RootState } from "../../redux/store";

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  minWidth: 350,
};

const RequisitionFormModal: React.FC = () => {
  const dispatch = useDispatch();
  const {mode} = useSelector((state: RootState) => state.requisition);


  const handleOpen = () => {
    dispatch(setMode("create"));
  };

  const handleClose = () => {
    dispatch(setMode("view"));
  };

  return (
    <>
      <IconButton
        sx={{
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
        }}
        onClick={handleOpen}
        aria-label="Adicionar Requisição"
      >
        <AddIcon sx={{ width: 24, height: 24 }} />
      </IconButton>
      <Modal open={mode === "create"} onClose={handleClose}>
        <Box sx={style}>
          <RequisitionForm />
        </Box>
      </Modal>
    </>
  );
};

export default RequisitionFormModal;
