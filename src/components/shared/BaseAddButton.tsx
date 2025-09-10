import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";


export const BaseAddButton = (props: {
  onClick?: () => void;
  text?: string;
}) => {
  const { onClick, text } = props;
  return (
    <IconButton
      sx={{
        bgcolor: "secondary.main",
        color: "white",
        borderRadius: "50%",
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          bgcolor: "secondary.main",
          scale: "1.1",
          transition: "all 0.2s ease-in-out",
        },
      }}
      onClick={onClick}
      aria-label={text ? text : "Adicionar"}
    >
      <AddIcon sx={{ width: 24, height: 24 }} />
    </IconButton>
  );
};
