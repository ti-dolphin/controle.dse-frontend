import React from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { red } from "@mui/material/colors";
import { useDispatch } from "react-redux";
import { setViewingProductAttachment } from "../../redux/slices/productSlice";
import { Product } from "../../models/Product";

interface ProductCardProps {
  row: Product;
  setProductBeingEdited: (product: any | null) => void;
  productBeingEdited: any | null;
  saveProductQuantity: (quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  row,
  setProductBeingEdited,
  productBeingEdited,
  saveProductQuantity,
}) => {
    const dispatch = useDispatch();
    const [localQuantity, setLocalQuantity] = React.useState(row.quantidade_estoque);

  return (
    <Box
      key={row.ID}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        p: 1,
        m: 1,
        bgcolor: "background.paper",
        borderRadius: 1,
        boxShadow: 1,
        gap: 1,
        width: 280,
        height: 280,
      }}
    >
      <Typography variant="subtitle2" color="primary.main" component="div">
        {row.descricao}
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Typography variant="body2" color="text.primary">
          Quantidade em estoque:
        </Typography>
        <Typography variant="body2" color="text.primary">
          {row.quantidade_estoque}
        </Typography>
        <IconButton
          onClick={() => {
            setProductBeingEdited(row);
          }}
          sx={{
            color: "primary.main",
            height: 30,
            width: 30,
            boxShadow: 3,
          }}
        >
          <EditIcon sx={{ height: 20, width: 20 }} />
        </IconButton>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="text.primary">
          Quantidade reservada:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {row.quantidade_reservada}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="text.primary">
          Quantidade disponível:
        </Typography>
        <Typography
          variant="body2"
          fontWeight={"bold"}
          color={row.quantidade_disponivel > 0 ? "success.main" : red[800]}
        >
          {row.quantidade_disponivel}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="text.primary">
          Unidade:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {row.unidade}
        </Typography>
      </Stack>
      <Button
        variant="contained"
        size="small"
        sx={{ fontSize: "small" }}
        startIcon={<AttachFileIcon />}
        onClick={() => dispatch(setViewingProductAttachment(row.ID))}
      >
        anexos
      </Button>

      <Dialog
        open={productBeingEdited !== null}
        onClose={() => {
          setProductBeingEdited(null);
        }}
        aria-labelledby="edit-quantity-dialog-title"
        aria-describedby="edit-quantity-dialog-description"
      >
        <DialogTitle id="edit-quantity-dialog-title">
          Editar quantidade em estoque
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Quantidade atual:</Typography>
          <TextField
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLocalQuantity(Number(e.target.value))
            }
            autoFocus
            margin="dense"
            id="name"
            label="Quantidade"
            type="number"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ fontSize: "small" }}
            onClick={() => {
              setProductBeingEdited(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ fontSize: "small" }}
            onClick={() => saveProductQuantity(localQuantity)}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductCard;
