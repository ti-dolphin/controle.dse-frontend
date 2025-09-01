import React from "react";
import { Box, Typography, Paper, Stack, Button, Card, CardContent, CardActions } from "@mui/material";

interface OpportunityCardProps {
  row: any;
  styles?: React.CSSProperties;
  onClick?: () => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  row,
  styles,
  onClick,
}) => {
  return (
    <Card
      elevation={3}
      sx={{
        ...styles,
        margin: "8px auto",
        boxShadow: 2,
        borderRadius: 2,
        overflow: "hidden",
        maxHeight: 300,
        minHeight: 300,
        fontSize: "0.8rem",
      }}
      style={styles}
      onClick={onClick}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "12px",
          fontSize: "0.8rem",
        }}
      >
        <Typography variant="h6" color="primary">
          {row.NOME || "Sem descrição"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Projeto: {row.projeto?.DESCRICAO || "Não informado"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Cliente: {row.cliente?.NOMEFANTASIA || "Não informado"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Responsável: {row.responsavel?.NOME || "Não informado"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Status: {row.status?.NOME || "Não informado"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Valor Total: {row.VALORTOTAL_FORMATTED || "R$ 0,00"}
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: "8px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={onClick}
            sx={{ fontSize: "0.75rem", padding: "4px 12px" }}
          >
            Ver Detalhes
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default OpportunityCard;
