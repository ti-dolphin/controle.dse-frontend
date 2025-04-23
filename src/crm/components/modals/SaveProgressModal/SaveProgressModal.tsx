import { Modal, Box, Typography, Button } from "@mui/material";
import { BaseButtonStyles } from "../../../../utilStyles";

interface SaveProgressModalProps {
    open: boolean;
    handleNo: () => void;
    handleYes: () => void;
}

const SaveProgressModal: React.FC<SaveProgressModalProps> = ({
  open,
  handleNo,
  handleYes,
}) => {
  return (
    <Modal
      open={open}
      aria-labelledby="save-progress-modal-title"
      aria-describedby="save-progress-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography id="save-progress-modal-title" variant="h6" component="h2">
          Salvar Alterações?
        </Typography>
        <Typography id="save-progress-modal-description" sx={{ mt: 2 }}>
          Deseja salvar suas alterações antes de fechar?
        </Typography>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button sx={{ ...BaseButtonStyles }} onClick={handleYes}>
            Sim
          </Button>
          <Button
            sx={{ ...BaseButtonStyles,  }}
            variant="outlined"
            color="secondary"
            onClick={handleNo}
          >
            Não
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default SaveProgressModal