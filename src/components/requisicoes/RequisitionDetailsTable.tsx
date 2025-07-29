import { Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { Requisition } from "../../models/requisicoes/Requisition";
import { getDateStringFromISOstring } from "../../utils";

const RequisitionDetailsTable = ({ requisition }: { requisition: Requisition }) => {
  return (
    <Table size="small" sx={{ "& td, & th": { border: 0, p: 0.5 } }}>
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography color="text.secondary" fontWeight={600}>
              Criada:
            </Typography>
          </TableCell>
          <TableCell>
            {requisition.data_criacao
              ? getDateStringFromISOstring(requisition.data_criacao)
              : "-"}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography color="text.secondary" fontWeight={600}>
              Atualizada em:
            </Typography>
          </TableCell>
          <TableCell>
            {requisition.data_alteracao
              ? getDateStringFromISOstring(requisition.data_alteracao)
              : "-"}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Typography color="text.secondary" fontWeight={600}>
              Atualizada por:
            </Typography>
          </TableCell>
          <TableCell>{requisition.alterado_por?.NOME || "-"}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Typography color="text.secondary" fontWeight={600}>
              Requisitante:
            </Typography>
          </TableCell>
          <TableCell>{requisition.responsavel?.NOME || "-"}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <Typography color="text.secondary" fontWeight={600}>
              Gerente:
            </Typography>
          </TableCell>
          <TableCell>{requisition.gerente?.NOME || "-"}</TableCell>
        </TableRow>

        {/* <TableRow>
          <TableCell>
            <Typography fontWeight={600}>Coordenador:</Typography>
          </TableCell>
          <TableCell>{requisition || "-"}</TableCell>
        </TableRow> */}

        <TableRow>
          <TableCell>
            <Typography color="text.secondary" fontWeight={600}>
              Tipo:
            </Typography>
          </TableCell>
          <TableCell>{requisition.tipo_requisicao?.nome_tipo || "-"}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default RequisitionDetailsTable;