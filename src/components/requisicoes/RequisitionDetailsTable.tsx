import { memo } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
} from "@mui/material";
import { Requisition } from "../../models/requisicoes/Requisition";
import { getDateStringFromISOstring } from "../../utils";

interface DetailRowProps {
  label: string;
  value: string | undefined;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <TableRow
    sx={{
      height: 20,
    }}
  >
    <TableCell
      sx={{
        py: 0.25,
        pr: 1,
        borderBottom: "none",
      }}
    >
      <Typography
        color="text.secondary"
        fontSize={12}
        fontWeight={600}
        sx={{ lineHeight: "1.2" }}
      >
        {label}:
      </Typography>
    </TableCell>
    <TableCell
      sx={{
        py: 0.25,
        borderBottom: "none",
      }}
    >
      <Typography
        fontSize={12}
        color="text.primary"
        sx={{ lineHeight: "1.2", fontWeight: 400 }}
      >
        {value || "-"}
      </Typography>
    </TableCell>
  </TableRow>
);

interface RequisitionDetailsTableProps {
  requisition: Requisition;
}

const RequisitionDetailsTable = ({
  requisition,
}: RequisitionDetailsTableProps) => {
  const rows: DetailRowProps[] = [
    {
      label: "Criada",
      value: requisition.data_criacao
        ? getDateStringFromISOstring(requisition.data_criacao)
        : undefined,
    },
    {
      label: "Atualizada em",
      value: requisition.data_alteracao
        ? getDateStringFromISOstring(requisition.data_alteracao)
        : undefined,
    },
    { label: "Atualizada por", value: requisition.alterado_por?.NOME },
    { label: "Requisitante", value: requisition.responsavel?.NOME },
    { label: 'Responsável projeto', value: requisition.projeto?.responsavel?.NOME},
    { label: "Gerente", value: requisition.gerente?.NOME },
    { label: "Tipo", value: requisition.tipo_requisicao?.nome_tipo },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        borderRadius: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === "light" ? "#f8f9fa" : "#1f1f1f",
      }}
    >
      <Table
        size="small"
        sx={{
          minWidth: "auto",
          "& td, & th": { border: 0 },
        }}
      >
        <TableBody>
          {rows.map((row, index) => (
            <DetailRow key={index} label={row.label} value={row.value} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default memo(RequisitionDetailsTable);
