import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import style from "./OpportuntiyInteraction.styles";
import { AnimatePresence, motion } from "framer-motion";
import { alertAnimation, BaseButtonStyles, buttonStylesMobile } from "../../../utilStyles";
import { Comment, Opportunity } from "../../types";
import { debounce } from "lodash";
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
  const [dataInteracao, setDataInteracao] = React.useState<Date>(opp.DATAINTERACAO && new Date(opp.DATAINTERACAO));
  const [comment, setComment] = React.useState<Comment>({
    CODCOMENTARIO: 0,
    CODAPONT: 0,
    CODOS: 0,
    DESCRICAO: "",
    RECCREATEDON: '',
    RECCREATEDBY: '',
    EMAIL: false,
  });
  const [comments, setComments] = React.useState<Comment[]>(opp.comentarios || []);
  const [editing, setEditing] = React.useState<boolean>(false);

  const debouncedSetOppDataInteracao = React.useCallback(
    debounce((newDataInteracao: Date) => {
      console.log('newDataInteracao', newDataInteracao);
      setOpp((prevOpp) => ({ ...prevOpp, DATAINTERACAO: newDataInteracao }));
    }, 300),
    [setOpp]
  );

  const updateExistingComment = (updatedComment: Comment) => {
    const comment = { 
      ...updatedComment,
      RECCREATEDON: new Date(),
      RECCREATEDBY: user?.NOME || '',
      EMAIL: false,
    }
    setComments((prevComentarios) =>
      prevComentarios.map((c) =>
        c.CODCOMENTARIO === comment.CODCOMENTARIO ? comment : c
      )
    );
    const updatedCommentsArray = opp.comentarios?.map((c) =>
      c.CODCOMENTARIO === comment.CODCOMENTARIO ? comment : c
    );
    setOpp((prevOpp) => ({
      ...prevOpp,
      comentarios: updatedCommentsArray,
    }));

  };

  const addNewComment = (newComment: Comment) => {
    const comment: Comment = {
      ...newComment,
      CODCOMENTARIO: Math.random() * 1000,
      CODOS: opp.CODOS,
      CODAPONT: 0,
      RECCREATEDON: new Date(),
      RECCREATEDBY: user?.NOME || '',
      EMAIL: false,
    };
    setComments((prevComentarios) => [...prevComentarios, comment]);
    setOpp((prevOpp) => ({
      ...prevOpp,
      comentarios: [...prevOpp.comentarios || [], comment],
    }));
  };

  const cleanUpComment = () => {
    setComment({
      CODCOMENTARIO: 0,
      CODAPONT: 0,
      CODOS: 0,
      DESCRICAO: "",
      RECCREATEDON: "",
      RECCREATEDBY: "",
      EMAIL: false,
    });
  }

  const handleConclude = () => {
    const existingComment = comments.some((c) => c.CODCOMENTARIO === comment.CODCOMENTARIO);
    if (existingComment) {
      updateExistingComment(comment);
      cleanUpComment();
      return;
    }
    addNewComment(comment);
    setEditing(false);
    cleanUpComment();
  };

  const handleCancel = () => {
    setComment({
      CODCOMENTARIO: 0,
      CODAPONT: 0,
      CODOS: 0,
      DESCRICAO: "",
      RECCREATEDON: '',
      RECCREATEDBY: '',
      EMAIL: false,
    });
    setEditing(false);
  };

  const handleDeleteComment = (commentId: number) => {
    setComments((prevComentarios) => prevComentarios.filter((c) => c.CODCOMENTARIO !== commentId));
    setOpp((prevOpp) => ({
      ...prevOpp,
      comentarios: prevOpp.comentarios?.filter((c) => c.CODCOMENTARIO !== commentId),
    }));
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
        value={dataInteracao ? dataInteracao.toISOString().split("T")[0] : null}
      />
      <Stack sx={{ width: "100%", gap: 2 }}>
        <TextField
          label="Comentário"
          placeholder="Digite seu comentário aqui..."
          type="text"
          multiline
          onFocus={() => setEditing(true)}
          value={comment.DESCRICAO}
          onChange={(e) =>
            setComment({
              ...comment,
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
        {comments.map((comment, index) => (
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
              <Typography sx={{ ...typographyStyles.heading2 }}>Por {comment.RECCREATEDBY}</Typography>
              <Typography sx={{ ...typographyStyles.bodyText }}>{comment.DESCRICAO}</Typography>
              <Typography sx={{ ...typographyStyles.smallText }}>
                {new Date(comment.RECCREATEDON)?.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
              </Typography>
            </Box>
            <Stack gap={1} direction="row" alignItems="center">
              <IconButton
                sx={{ ...buttonStylesMobile, height: 35, width: 30 }}
                onClick={() => {
                  setComment(comment);
                  setEditing(true);
                }}
              >
                <EditIcon sx={{ color: "white" }} />
              </IconButton>
              <IconButton
                sx={{ ...buttonStylesMobile, height: 35, width: 30 }}
                onClick={() => handleDeleteComment(comment.CODCOMENTARIO)}
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
