import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import { User } from "../../models/User";
import { UserService } from "../../services/UserService";

interface BuyerSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (buyerId: number | null) => void;
  currentBuyerId?: number;
}

const BuyerSelectionDialog: React.FC<BuyerSelectionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  currentBuyerId,
}) => {
  const [buyers, setBuyers] = useState<User[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBuyers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await UserService.getMany({ PERM_COMPRADOR: 1});
      setBuyers(response);
      
      if (currentBuyerId) {
        const currentBuyer = response.find(
          (buyer) => buyer.CODPESSOA === currentBuyerId
        );
        setSelectedBuyer(currentBuyer || null);
      }
    } catch (error) {
      console.error("Erro ao buscar compradores:", error);
    } finally {
      setLoading(false);
    }
  }, [currentBuyerId]);

  useEffect(() => {
    if (open) {
      fetchBuyers();
    }
  }, [open, fetchBuyers]);

  const handleConfirm = () => {
    onConfirm(selectedBuyer?.CODPESSOA || null);
    onClose();
  };

  const handleClose = () => {
    setSelectedBuyer(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Selecionar Comprador</DialogTitle>
      <DialogContent>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <CircularProgress />
          </div>
        ) : (
          <Autocomplete
            options={buyers}
            getOptionLabel={(option) => option.NOME}
            value={selectedBuyer}
            onChange={(_, newValue) => setSelectedBuyer(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Comprador"
                placeholder="Selecione um comprador"
                margin="normal"
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option.CODPESSOA === value.CODPESSOA
            }
            noOptionsText="Nenhum comprador encontrado"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BuyerSelectionDialog;
