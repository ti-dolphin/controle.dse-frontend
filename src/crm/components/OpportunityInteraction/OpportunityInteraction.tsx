import { Box, Button, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import style from "./OpportuntiyInteraction.styles";
import { AnimatePresence, motion } from "framer-motion";
import { alertAnimation, BaseButtonStyles, buttonStylesMobile } from "../../../utilStyles";
import { Comentario, Opportunity } from "../../types";
import { add, debounce } from "lodash";
import typographyStyles from "../../../Requisitions/utilStyles";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { userContext } from "../../../Requisitions/context/userContext";

interface props {
   opp: Opportunity;
   setOpp: React.Dispatch<React.SetStateAction<Opportunity>>;
}

const OpportunityInteraction = ({ opp, setOpp }: props) => {
  const { user } = useContext(userContext);
  const [dataInteracao, setDataInteracao] = React.useState<Date>(new Date(opp.DATAINTERACAO));
  const [comentario, setComentario] = React.useState<Comentario>({
    CODCOMENTARIO: 0,
    CODAPONT: 0,
    CODOS: 0,
    DESCRICAO: "",
    RECCREATEDON: '',
    RECCREATEDBY: '',
    EMAIL: "",
  });
  const [comentarios, setComentarios] = React.useState<Comentario[]>([]);
  const [editing, setEditing] = React.useState<boolean>(false);

  const debouncedSetOppDataInteracao = React.useCallback(
    debounce((newDataInteracao: Date) => {
      setOpp((prevOpp) => ({ ...prevOpp, DATAINTERACAO: newDataInteracao }));
    }, 300),
    [setOpp]
  );

  const updateExistingComment = (updatedComment: Comentario) => {
    const comment = { 
      ...updatedComment,
      RECCREATEDON: new Date(),
      RECCREATEDBY: user?.NOME || '',
      EMAIL: user?.NOME || "",
    }
    setComentarios((prevComentarios) =>
      prevComentarios.map((c) =>
        c.CODCOMENTARIO === comment.CODCOMENTARIO ? comment : c
      )
    );
  };

  const addNewComment = (newComment: Comentario) => {
    const comment: Comentario = {
      ...newComment,
      CODCOMENTARIO: Math.random() * 1000,
      RECCREATEDON: new Date(),
      RECCREATEDBY: user?.NOME || '',
      EMAIL: user?.NOME || "",
    };
    setComentarios((prevComentarios) => [...prevComentarios, comment]);
  };

  const cleanUpComment = () => {
    setComentario({
      CODCOMENTARIO: 0,
      CODAPONT: 0,
      CODOS: 0,
      DESCRICAO: "",
      RECCREATEDON: "",
      RECCREATEDBY: "",
      EMAIL: "",
    });
  }

  const handleConclude = () => {
    const existingComentario = comentarios.some((c) => c.CODCOMENTARIO === comentario.CODCOMENTARIO);
    if (existingComentario) {
      updateExistingComment(comentario);
      cleanUpComment();
      return;
    }
    addNewComment(comentario);
    setEditing(false);
    cleanUpComment();
  };

  const handleCancel = () => {
    setComentario({
      CODCOMENTARIO: 0,
      CODAPONT: 0,
      CODOS: 0,
      DESCRICAO: "",
      RECCREATEDON: '',
      RECCREATEDBY: '',
      EMAIL: "",
    });
    setEditing(false);
  };

  useEffect(() => {
    debouncedSetOppDataInteracao(dataInteracao);
    return () => {
      debouncedSetOppDataInteracao.cancel();
    };
  }, [dataInteracao, debouncedSetOppDataInteracao]);

  return (
    <Box sx={style.container}>
      <TextField
        fullWidth
        label="Data de Interação"
        type="date"
        onChange={(e) => setDataInteracao(new Date(e.target.value))}
        InputLabelProps={{ shrink: true }}
        value={dataInteracao.toISOString().split("T")[0]}
      />
      <Stack sx={{ width: "100%", gap: 2 }}>
        <TextField
          label="Comentário"
          placeholder="Digite seu comentário aqui..."
          type="text"
          multiline
          onFocus={() => setEditing(true)}
          value={comentario.DESCRICAO}
          onChange={(e) =>
            setComentario({
              ...comentario,
              DESCRICAO: e.target.value,
            })
          }
          rows={3}
          variant="outlined"
          fullWidth
          sx={style.commentField}
        />
        {editing && (
          <AnimatePresence>
            <motion.div {...alertAnimation}>
              <Stack direction="row" gap={1}>
                <Button onClick={handleCancel} sx={BaseButtonStyles}>
                  Cancelar
                </Button>
                <Button onClick={() => handleConclude()} sx={BaseButtonStyles}>
                  Concluir
                </Button>
              </Stack>
            </motion.div>
          </AnimatePresence>
        )}
      </Stack>
      <Stack sx={{ marginTop: 2, gap: 2, maxHeight: 300, overflowY: "scroll", width: "100%" }}>
        {comentarios.map((comentario, index) => (
          <Box
            sx={{
              display: "flex",
              padding: 1,
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            key={index}
          >
            <Box>
              <Typography sx={{ ...typographyStyles.heading2 }}>Por {comentario.RECCREATEDBY}</Typography>
              <Typography sx={{ ...typographyStyles.bodyText }}>{comentario.DESCRICAO}</Typography>
              <Typography sx={{ ...typographyStyles.smallText }}>
                {comentario.RECCREATEDON?.toLocaleString()}
              </Typography>
            </Box>
            <Stack gap={1} direction="row" alignItems="center">
              <IconButton
                sx={{ ...buttonStylesMobile, height: 35, width: 30 }}
                onClick={() => {
                  setComentario(comentario);
                  setEditing(true);
                }}
              >
                <EditIcon sx={{ color: "white" }} />
              </IconButton>
              <IconButton
                sx={{ ...buttonStylesMobile, height: 35, width: 30 }}
                onClick={() => {
                  setComentarios((prevComentarios) => prevComentarios.filter((_, i) => i !== index));
                }}
              >
                <DeleteIcon sx={{ color: "white" }} />
              </IconButton>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default OpportunityInteraction;
