import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";


export const BaseAddButton = (props: {
  handleOpen: () => void;
  text?: string;
}) => {
  const { handleOpen, text } = props;
  return (
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
      aria-label={text ? text : "Adicionar"}
    >
      <AddIcon sx={{ width: 24, height: 24 }} />
    </IconButton>
  );
};
