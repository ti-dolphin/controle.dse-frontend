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

const getTypeByTipoFaturamento = (tipoFaturamento: any) => {
  switch (tipoFaturamento) {
    case 1:
      return "Faturamento Dolphin";
    case 2:
      return "Faturamento Direto";
    case 3:
      return "Compras Operacional";
    case 4 :
      return "Estoque";
    case 5: 
      return "Estoque Operacional";
    case 6:
      return "Compras TI";
    case 7:
      return "Estoque TI";
    default:
      return "-";
  }
}

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
    { label: 'Responsável do projeto', value: requisition.responsavel_projeto?.NOME },
    { label: "Gerente do projeto", value: requisition.gerente?.NOME },
    {
      label: "Tipo",
      value: getTypeByTipoFaturamento(requisition.tipo_faturamento).toUpperCase(),
    },
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
