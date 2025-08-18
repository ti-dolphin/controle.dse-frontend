import React from "react";
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Box,
} from "@mui/material";
import { Movimentation } from "../../models/patrimonios/Movementation";
import { getDateStringFromISOstring } from "../../utils";
import { useNavigate } from "react-router-dom";

interface Props {
    patrimonyMov: Movimentation;
    styles?: any;
}

const MAX_DESC_LENGTH = 60;

const truncate = (text: string | undefined, max: number) =>
    text && text.length > max ? text.slice(0, max) + "..." : text;

const PatrimonyCard = ({ patrimonyMov, styles }: Props) => {
    const navigate = useNavigate();

    return (
      <Card
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
          <Typography
            variant="subtitle1"
            component="div"
            gutterBottom
            sx={{ fontSize: "0.95rem", fontWeight: 600 }}
          >
            {patrimonyMov.patrimonio_nome}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: "0.8rem" }}
          >
            <strong>Número de Série:</strong> {patrimonyMov.patrimonio_nserie}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: "0.8rem" }}
          >
            <strong>Descrição:</strong>{" "}
            {truncate(
              patrimonyMov.patrimonio_descricao || "Não informado",
              MAX_DESC_LENGTH
            )}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: "0.8rem" }}
          >
            <strong>Responsável:</strong> {patrimonyMov.responsavel_nome}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: "0.8rem" }}
          >
            <strong>Projeto:</strong> {patrimonyMov.projeto_descricao}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: "0.8rem" }}
          >
            <strong>Data da Movimentação:</strong>{" "}
            {getDateStringFromISOstring(patrimonyMov.data)}
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
              onClick={() => navigate(`/patrimonios/${patrimonyMov.id_patrimonio}`)}
              sx={{ fontSize: "0.75rem", padding: "4px 12px" }}
            >
              Ver Detalhes
            </Button>
          </Box>
        </CardActions>
      </Card>
    );
};

export default PatrimonyCard;