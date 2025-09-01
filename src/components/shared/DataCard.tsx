import React from "react";
import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";

interface DataCardProps {
  data: any;
  fields: { label: string; field: string }[];
  onClickDetails: (id: string | number) => void;
  styles: React.CSSProperties;
}

const DataCard: React.FC<DataCardProps> = ({
  data,
  fields,
  onClickDetails,
  styles,
}) => {
  const theme = useTheme();

  return (
    <Box sx={styles}>
      <Card
        sx={{
          width: 280,
          height: 300,
          m: 1,
          cursor: "pointer",
          boxShadow: theme.shadows[2],
          "&:hover": {
            boxShadow: theme.shadows[4],
          },
        }}
        onClick={() =>
          onClickDetails(data.id || data.ID_REQUISICAO || data.CODOS)
        }
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {fields.map(({ label, field }) => (
            <Box
              key={field}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="body2" color="text.secondary">
                {label}:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
               teste
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DataCard;
