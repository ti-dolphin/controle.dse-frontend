import React from "react";
import { Requisition } from "../../models/requisicoes/Requisition";
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { formatCurrency } from "../../utils";

interface props {
  req: Requisition;
  style: any;
  onClickDetails: (id: string | number) => void;
}
const RequisitionCard = ({ req, style, onClickDetails }: props) => {
  return (
    <Card
      sx={{
        ...style,
        margin: "8px auto",
        boxShadow: 2,
        borderRadius: 2,
        overflow: "hidden",
        minHeight: 200,
        maxHeight: 300,
        fontSize: "0.8rem",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0.5,
          padding: "12px",
          fontSize: "0.8rem",
        }}
      >
        <Typography
          variant="subtitle1"
          component="div"
          gutterBottom
          sx={{ fontSize: "0.95rem", fontWeight: 600 }}
        >
          {req.DESCRIPTION}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: "0.8rem" }}
        >
          <Typography component={"strong"} variant="body2" color="primary.main">
            ID
          </Typography>{" "}
          {req.ID_REQUISICAO}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: "0.8rem" }}
        >
          <Typography component={"strong"} variant="body2" color="primary.main">
            Responsável:
          </Typography>{" "}
          {req.responsavel?.NOME}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: "0.8rem" }}
        >
          <Typography component={"strong"} variant="body2" color="primary.main">
            Projeto:
          </Typography>{" "}
          {req.projeto?.DESCRICAO}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          <Typography component={"strong"} variant="body2" color="primary.main">
            Valor Total:
          </Typography>{" "}
          {formatCurrency(Number(req.custo_total)) || "R$ 0,00"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={( ) => onClickDetails(req.ID_REQUISICAO)}>
          Detalhes
        </Button>
      </CardActions>
    </Card>
  );
};

export default RequisitionCard;

