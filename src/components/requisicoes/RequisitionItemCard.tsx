import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { RequisitionItem } from "../../models/requisicoes/RequisitionItem";

interface RequisitionItemCardProps {
  item: RequisitionItem;
  style: any;
}

const RequisitionItemCard: React.FC<RequisitionItemCardProps> = ({
  item,
  style,
}) => {
  return (
    <Box
      sx={{
        ...style,
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: 2,
        marginBottom: "8px",
        display: "flex",
        maxHeight: 190,
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <Typography variant="subtitle1" color="primary.main">
        {item.produto_descricao || "Descrição não disponível"}
      </Typography>
      <Typography variant="body2">Quantidade: {item.quantidade}</Typography>
      <Typography variant="body2">
        Data de Entrega: {item.data_entrega || "Não definida"}
      </Typography>
      <Typography variant="body2">OC: {item.oc || "Não preenchido"}</Typography>
      {/* <Box sx={{ display: "flex", flexDirection: "column",  gap: "8px" }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => item.oc && handleFillOCS(Number(item.oc))}
        >
          Preencher OC
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() =>
            item.data_entrega && handleFillShippingDate(item.data_entrega)
          }
        >
          Preencher Data de Entrega
        </Button>
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={() => handleDeleteItem(item.id_item_requisicao)}
        >
          Excluir
        </Button>
      </Box> */}
    </Box>
  );
};

export default RequisitionItemCard;
