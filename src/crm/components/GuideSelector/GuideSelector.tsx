import { Stack, Chip, Button } from "@mui/material";
import { styles } from "./GuideSelector.styles";


const GuideSelector = ({
  slideIndex,
  handleChangeGuide
} : any ) => {
  const guides = [
    { label: "Cadastro", value: 0 },
    { label: "Interação", value: 1 },
    { label: "Escopo", value: 2 },
    { label: "Venda", value: 3 },
    { label: "Seguidores", value: 4 }
  ]
  return (
    <Stack direction="row" sx={styles.guideSelectorContainer}>
      {guides.map((guide, index) => (
          <Chip
            onClick={() => handleChangeGuide(guide.value)}
            key={index}
            label={guide.label}
            variant="outlined"
            sx={{
              width: 100,
              backgroundColor:
                guide.value === slideIndex ? "lightgray" : "white",
              "&:hover": {
                backgroundColor: "lightgray",
              },
            }}
          />
      ))}
    </Stack>
  );
};
export default GuideSelector;
